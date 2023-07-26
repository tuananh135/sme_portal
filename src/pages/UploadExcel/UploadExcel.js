import { Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ReactComponent as ExcelIcon } from 'assets/images/icon-excel.svg'
import Dragger from 'antd/lib/upload/Dragger'
import ChatIcon from 'common/components/ChatIcon/ChatIcon'
import { CloudUploadOutlined } from '@ant-design/icons'
import SampleExcel from 'assets/documents/sample-upload-employee.xlsx'
import { FILE_TYPE } from 'common/constants/constants'
import { readFileToObject, validateFileTypeAndSize } from 'common/utils/fileUtils'
import { SpinnerCircular } from 'spinners-react'
import { CheckErrorInUploadedMembers, convertExcelDataToRequestObj, FileErrorCheck } from './Data/EmployeeImportDataHelpers'
import PrimaryButton from 'common/components/Button/PrimaryButton'
import CancelButton from 'common/components/Button/CancelButton'
import { PAGE_LINK } from 'common/constants/pagelinks'
import { NotificationDispatchContext } from 'contexts/NotificationContext'
import NotificationModalWithImage from 'common/components/Modal/NotificationModalWithImage'
import { EmployeeGroupService } from 'services/B2CService/EmployeeGroupService'
import { MEMBER_ERRORS } from 'common/constants/membersCheckingError'
import { CategoryStateContext } from 'contexts/CategoryContext'
import { BudgetService } from 'services/B2CService/BudgetService'
import { PersonService } from 'services/B2CService/PersonService'
import usePostalCode from 'hooks/_usePostalCode'
import { getDoBFromNRIC } from 'common/utils/dateUtils'
import { GetNewCombiForEmployeeWithDependentAndFamily } from 'common/constants/budgetConstant'
import StepProgressTrigger from 'common/components/StepPanel/StepProgressTrigger'
const Wrapper = styled.div`
  align-items: center;
  text-align: center;
  justify-content: center;
`

const StyledDragger = styled(Dragger)`
  background-color: black !important;
  width: 90vw !important;
  max-width: 600px;
  height: 300px !important;
  max-height: 50vh !important;
`

const Spinner = styled(SpinnerCircular)`
  color: #ff2626 !important;
  overflow: visible !important;
  width: 50px !important;
`

const ClickToUploadText = styled.span`
  position: absolute;
  top: 5%;
  left: 5%;
`

function UploadExcel({ isMobile }) {
  const navigate = useNavigate()
  const { countryList } = useContext(CategoryStateContext)
  const { id } = useParams()
  const [data, setData] = useState()
  const [empOject, setEmpObject] = useState([])
  const [isUploaded, setIsUploaded] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorText, setShowErrorText] = useState(null)
  const { updateNotification } = useContext(NotificationDispatchContext)
  const [combinationData, setCombinationData] = useState([])
  const [combinationByGroup, setCombinationByGroup] = useState([])
  const getCombiByGroup = async () => {
    const result = await BudgetService.GetCombiByEmpGroup(id)
    if (result.data?.length > 0) {
      setCombinationData(result.data.filter((item) => item.rank !== 0).map((item) => item.rank))
      setCombinationByGroup(result.data)
    }
  }
  const { addressDebounceFn, address } = usePostalCode()
  useEffect(() => {
    getCombiByGroup()
  }, [])

  const props = {
    name: 'file',
    multiple: false,
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        console.log(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        console.log(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const beforeUpload = async (file) => {
    const validateResult = validateFileTypeAndSize(file, FILE_TYPE.CSV_XLSX, 20)
    if (validateResult.error) {
      updateNotification([
        {
          id: Math.random(),
          message: validateResult?.message,
          types: 'error',
        },
      ])
    }
    return validateResult.error ? true : false
  }

  const handleUpload = async (e) => {
    console.log(e)
    let dataList = await readFileToObject(e.file)
    let isGTLOnly = JSON.parse(localStorage.getItem('isGTLOnly'))
    let originalDataLength = dataList.length

    if (isGTLOnly?.length > 0 && isGTLOnly[0].status) {
      dataList = dataList.filter((element) => {
        const relationship = element['Relationship  with Employee']
        console.log('removed', element['No'] + '-' + relationship)
        return relationship === 'Employee'
      })

      if (dataList.length < originalDataLength) {
        updateNotification([
          {
            id: Math.random(),
            message: 'You have selected Group Term Life and Group Term Life do not cover for employees’ dependents. Hence, we will not process any dependents data',
            types: 'error',
          },
        ])
      }
    }

    setData(dataList)
    setIsUploaded(true)
    setTimeout(() => {
      setIsUploaded(false)
      setIsReading(true)
    }, 1000)
    setTimeout(() => {
      readFileAndChecking(dataList)
    }, 2000)
  }
  const handlePostalCode = async (data) => {
    let resultArray = []
    for (let index = 0; index < data.length; index++) {
      const item = data[index]
      const addressResult = await new Promise((resolve) => {
        addressDebounceFn(item.postcode, (address) => {
          resolve({ ...address, index })
        })
      })

      resultArray.push(addressResult)
    }
  }

  const handleCoverType = async (data) => {
    let totalEmpPlus = 0
    let totalEmpWithFamily = 0
    let newBudgetDetails = []

    for (const combiData of combinationByGroup) {
      let employee = data.filter((e) => e.rank === combiData.rank)
      let totalEmpOnly = employee.filter((e) => e.dependents.length === 0).length
      const employeesWithSpouseDependents = employee.filter((employee) => {
        const spouseDependents = employee.dependents.filter((dependent) => dependent.relationship === 'Spouse')
        return employee.dependents.length > 0 && spouseDependents.length === employee.dependents.length
      })

      const employeesWithChildDependents = employee.filter((employee) => {
        const childDependents = employee.dependents.filter((dependent) => dependent.relationship === 'Child')
        return employee.dependents.length > 0 && childDependents.length === employee.dependents.length
      })

      totalEmpPlus = employeesWithSpouseDependents.length + employeesWithChildDependents.length
      totalEmpWithFamily = employee.filter((employee) => {
        const spouseDependents = employee.dependents.some((dependent) => dependent.relationship === 'Spouse')
        const childDependents = employee.dependents.some((dependent) => dependent.relationship === 'Child')
        return spouseDependents && childDependents
      }).length
      let newCombi = await GetNewCombiForEmployeeWithDependentAndFamily(3, combiData)
      if (totalEmpOnly > 0) {
        let newCombiForEmployee = newCombi.filter((item) => item.dependentStatus === null)
        let premiumNettEmployee = parseFloat(newCombiForEmployee[0]?.premiumNett) || 0
        let totalPremiumNettEmployee = totalEmpOnly * premiumNettEmployee
        let budgetDetailEmpOnly = {
          id: combiData.id,
          groupId: combiData.groupId,
          rank: combiData.rank,
          combiNo: combiData.combiNo,
          type: 0,
          budgetBasedData: combiData.budgetBasedData,
          userId: combiData.userId,
          commencementDate: null,
          amount: totalPremiumNettEmployee,
        }
        newBudgetDetails.push(budgetDetailEmpOnly)
      }

      let totalDependent = employee.map((emp) => emp.dependents.length).reduce((acc, val) => acc + val, 0)
      if (totalDependent > 0) {
        if (newCombi && totalEmpWithFamily > 0) {
          let newCombiForFamily = newCombi.filter((item) => item.dependentStatus === 'Family')
          let premiumNettFamily = parseFloat(newCombiForFamily[0]?.premiumNett) || 0
          let totalPremiumNettFamily = totalEmpWithFamily * premiumNettFamily
          let budgetDetailEmpFamily = {
            id: combiData.id,
            groupId: combiData.groupId,
            rank: combiData.rank,
            combiNo: newCombiForFamily[0].combiNo,
            type: 1,
            budgetBasedData: newCombiForFamily[0],
            userId: combiData.userId,
            commencementDate: null,
            amount: totalPremiumNettFamily,
          }
          newBudgetDetails.push(budgetDetailEmpFamily)
        }
        if (newCombi && totalEmpPlus > 0) {
          let newCombiForEmpPlus = newCombi.filter((item) => item.dependentStatus !== 'Family') //Employee with kid / Employee with spouse
          let premiumNettEmployeePlus = parseFloat(newCombiForEmpPlus[0]?.premiumNett) || 0
          let totalPremiumNettEmployeePlus = totalEmpPlus * premiumNettEmployeePlus
          let budgetDetailEmpPlus = {
            id: combiData.id,
            groupId: combiData.groupId,
            rank: combiData.rank,
            combiNo: newCombiForEmpPlus[0].combiNo,
            type: 2,
            budgetBasedData: newCombiForEmpPlus[0],
            userId: combiData.userId,
            commencementDate: null,
            amount: totalPremiumNettEmployeePlus,
          }
          newBudgetDetails.push(budgetDetailEmpPlus)
        }
      }
    }
    if (newBudgetDetails.length > 0) {
      //update budget detail
      const result = await BudgetService.UpdateBugdetDetail(newBudgetDetails)
      if (result.data && result.data.length > 0) {
        console.log('Updated', result.data)
      }
    }
  }

  const readFileAndChecking = async (dataList) => {
    try {
      const uploadResult = convertExcelDataToRequestObj(dataList, countryList, combinationData)

      setEmpObject(uploadResult)

      handleCoverType(uploadResult)

      const fileCheck = FileErrorCheck(dataList)
      if (fileCheck.length > 0) {
        setShowErrorModal(true)
        setShowErrorText(fileCheck[0])
        return
      }
      const sanctionModel = []
      uploadResult.forEach((element, index) => {
        sanctionModel.push({
          nric: element.nric,
          passport: element.passport,
          customerName: element.name,
          index: index,
          country: countryList.find((c) => c.isO_Cd == element.nationality).country_Nm,
        })
        element?.dependents?.forEach((dep, depIndex) => {
          sanctionModel.push({
            nric: dep.nric,
            passport: dep.passport,
            customerName: dep.name,
            index: index + '_' + depIndex,
            country: countryList.find((c) => c.isO_Cd == dep.nationality).country_Nm,
          })
        })
      })
      const postalCodeResults = await handlePostalCode(
        uploadResult?.map((e, index) => ({
          postcode: e?.address?.postalCode,
          index: index,
        })),
      )
      const sanctionChecking = await EmployeeGroupService.CheckXlsxBlackList(sanctionModel)
      uploadResult.forEach(async (e, i) => {
        const validatePostcode = postalCodeResults.find((item) => item.index === i)
        if (validatePostcode?.City === undefined && validatePostcode?.State === undefined) {
          e.errorStatus.push({ field: 'address.postalCode', error: MEMBER_ERRORS.POSTALCODE })
        }
        const sanctionItem = sanctionChecking?.find((item) => item.index === i)
        if (sanctionItem) {
          if (sanctionItem?.countrySanctioned) {
            e.errorStatus.push({ field: 'nationality', error: MEMBER_ERRORS.COUNTRY_SANCTION })
          }
          if (sanctionItem?.nameSanctioned) {
            e.errorStatus.push({ field: 'name', error: MEMBER_ERRORS.NAME_SANCTION })
          }
          if (sanctionItem?.nricSanctioned) {
            e.errorStatus.push({ field: 'nric', error: MEMBER_ERRORS.NRIC_SANCTION })
          }
          if (sanctionItem?.passportSanctioned) {
            e.errorStatus.push({ field: 'passport', error: MEMBER_ERRORS.PASSPORT_SANCTION })
          }
        }
        e?.dependents?.forEach((dep, depIndex) => {
          const depSanctionItem = sanctionChecking?.find((item, index) => item.index?.split('_')?.at(1) == depIndex)

          if (depSanctionItem?.countrySanctioned) {
            dep.errorStatus.push({ field: 'nationality', error: MEMBER_ERRORS.COUNTRY_SANCTION })
          }
          if (depSanctionItem?.nameSanctioned) {
            dep.errorStatus.push({ field: 'name', error: MEMBER_ERRORS.NAME_SANCTION })
          }
          if (depSanctionItem?.nricSanctioned) {
            dep.errorStatus.push({ field: 'nric', error: MEMBER_ERRORS.NRIC_SANCTION })
          }
          if (depSanctionItem?.passportSanctioned) {
            dep.errorStatus.push({ field: 'passport', error: MEMBER_ERRORS.PASSPORT_SANCTION })
          }
        })
      })

      setIsReading(false)
      const result = await PersonService.DeletePersonByGroupId(id)
      if (!result) {
        return
      }

      const uploadNewData = uploadResult
        ?.filter((item) => item.relationship.toLowerCase() === 'employee')
        .map((item) => ({
          GroupID: id,
          Name: item.name,
          NRIC: item.nric,
          Passport: item.passport,
          visaIssueDate: item.visaIssueDate,
          visaExpiry: item.visaExpiry,
          Nationality: item.nationality,
          DateOfBirth: item.nationality?.toLowerCase() === 'mys' ? getDoBFromNRIC(item.nric) : item?.dateOfBirth,
          Email: item.email,
          Role: item.role,
          OrgName: item.orgName,
          Position: item.position,
          PositionYears: item.positionYears,
          MobileNumber: item.mobileNumber,
          MobileCountry: '+60',
          Rank: item.rank,
          Gender: item.gender,
          BankAccount: item.bankAccount,
          BankName: item.bankName,
          JoiningDate: item.joiningDate,
          Pep: item.pep,
          Type: 'EMPLOYEE',
          Address: item.address,
          dependents: (item.dependents ?? []).map((m) => ({ ...m, groupId: id })),
          documents: (item.documents ?? []).map((m) => ({ ...m, groupId: id })),
          healthQuestions: item.healthQuestions ?? [],
          relationship: item.relationship.toLowerCase(),
          staffId: item.staffId,
          pepDeclaration: item.pepDeclaration,
          status: item.errorStatus?.length > 0 ? 2 : 1,
        }))
      const postEmpResult = await EmployeeGroupService.PostPersonDetails(uploadNewData)
      if (!postEmpResult) {
        throw 'Error during execution'
      }
      setIsReading(false)
      navigate(PAGE_LINK.UPLOAD_FILE_RESULT.NAME + `/${id}`, {
        state: {
          data: uploadResult,
        },
      })
    } catch (error) {
      updateNotification([
        {
          id: Math.random(),
          message: 'Error during execution!',
          types: 'error',
        },
      ])
      setIsReading(false)
    }
  }

  return (
    <Wrapper className="d-flex d-flex-c">
      <ChatIcon pageName="uploadFile" width={50} className="mb-5" />
      <div className=" text-white mb-5">
        You may download and complete the excel file
        <br />
        below. Once done, please upload here.
        <br />{' '}
        {isMobile ? (
          <span>
            Our system will auto-integrate your employee <br /> data from it
          </span>
        ) : (
          <span className="text-small">Our system will auto-integrate your employee data from it</span>
        )}
      </div>
      <a href={SampleExcel} download="sample-upload-employee.xlsx">
        <Button className="TuneDownloadExcelButton mb-1">
          <ExcelIcon />
          Download Excel file Template
        </Button>
      </a>

      <StepProgressTrigger className="mb-5" />
      <StyledDragger {...props} className="self-center upload-excel" beforeUpload={beforeUpload} onChange={handleUpload} multiple={false} showUploadList={false}>
        {isUploaded ? (
          <>
            <ExcelIcon width={20} />
            <p className="ant-upload-text">uploaded!</p>
          </>
        ) : isReading ? (
          <>
            <Spinner сolor="#ff2626" secondaryColor="#843d47" thickness={250} />
            <p className="ant-upload-text">Please wait...</p>
          </>
        ) : (
          <>
            <ClickToUploadText className="ant-upload-text">+ Select file</ClickToUploadText>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined color="red" />
            </p>
            <p className="ant-upload-text">Drag & Drop</p>
          </>
        )}
      </StyledDragger>
      {isReading ? <PrimaryButton rootclass="half-width-button" text={'NEXT'} /> : <CancelButton rootclass="half-width-button" text={'NEXT'} disabled={true} />}
      <NotificationModalWithImage
        className="w-90 max-width-input border-round"
        isVisible={showErrorModal}
        buttonText="Ok"
        buttonClass="w-50 max-width-button my-2"
        confirmation={errorText}
        onClose={() => setShowErrorModal(false)}
      />
    </Wrapper>
  )
}

export default UploadExcel
