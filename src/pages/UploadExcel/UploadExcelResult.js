import { Button, Col, Table, Tabs } from 'antd'
import PrimaryButton from 'common/components/Button/PrimaryButton'
import ChatIcon from 'common/components/ChatIcon/ChatIcon'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import ResultTabContent from './components/ResultTabContent'
import { ReactComponent as InfoIcon } from 'assets/images/icon-info-white.svg'
import { ReactComponent as InfoSuccessIcon } from 'assets/images/icon-info-success.svg'
import { ReactComponent as SuccessIcon } from 'assets/images/icon-tick-primary.svg'
import { UpOutlined, WarningOutlined } from '@ant-design/icons'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PurchaseDetailModal from 'common/components/Modal/PurchaseDetailModal'
import DirectorDetailModal from 'pages/DirectorDetail/DirectorDetailModal'
import { PAGE_LINK } from 'common/constants/pagelinks'
import NotificationModal from 'common/components/Modal/NotificationModal'
import PersonInfoModal from 'pages/PersonDetail/PersonInfoModal'
import { EmployeeGroupService } from 'services/B2CService/EmployeeGroupService'
import { BudgetService } from 'services/B2CService/BudgetService'
import moment from 'moment'
import PersonDetailModal from 'pages/PersonDetail/PersonDetailModal'
import { NotificationDispatchContext } from 'contexts/NotificationContext'
import ConfirmModal from 'common/components/Modal/ConfirmModal'
import { ReactComponent as ErrorIcon } from 'assets/images/icon-error-small.svg'
import { CheckErrorInUploadedMembers } from './Data/EmployeeImportDataHelpers'
import { getDoBFromNRIC, getAgeFromNRIC, getAgeFromDoB } from 'common/utils/dateUtils'
import { MEMBER_ERRORS } from 'common/constants/membersCheckingError'
import { get_StampDuty, calculateTotalPremium } from 'common/constants/budgetConstant'
import { addThousandSeparator } from 'common/utils/stringUtils'
import { PersonService } from 'services/B2CService/PersonService'
import BorderedButton from 'common/components/Button/BorderedButton'
import StepProgressTrigger from 'common/components/StepPanel/StepProgressTrigger'

const Wrapper = styled.div`
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 100%;
`

const ContentWrapper = styled.div`
  align-items: center;
  background-color: white;
  text-align: center;
  justify-content: center;
  overflow-y: auto;
  height: 40vh;
  @media only screen and (max-width: 768px) {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const BottomWrapper = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
`

const UpdateDirectorWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${(props) => (props.hasDirectorInfo ? '#61a611' : '#d00000')};
  width: 100%;
  padding: 4px;
`

const IconWrapper = styled(InfoIcon)`
  position: relative;
  bottom: 15px;
`

const InfoSuccessIconWrapper = styled(InfoSuccessIcon)`
  position: relative;
  bottom: 15px;
`

const BottomButtonWrapper = styled.div`
  justify-content: space-around;
  align-items: center;
`

const TotalWrapper = styled.div`
  align-self: center;
`

function UploadExcelResult() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [employeeList, setEmployeeList] = useState([])
  const [errorData, setErrorData] = useState([])
  const [showPurchaseDetail, setShowPurchaseDetail] = useState(false)
  const [showDirectorModal, setShowDirectorModal] = useState(false)
  const [hasDirectorInfo, setHasDirectorInfo] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showErrorDataModal, setShowErrorDataModal] = useState(false)
  const [showConfirmReuploadModal, setShowConfirmReuploadModal] = useState(false)
  const [currentEmp, setCurrentEmp] = useState(null)
  const [combinationData, setCombinationData] = useState([])
  const [currentRankCombi, setCurrentRankCombi] = useState(null)
  const [currentTab, setCurrentTab] = useState(1)
  const [directorInfo, setDirectorInfo] = useState(null)
  const [editInfoModalState, setEditInfoModalState] = useState({
    display: false,
    type: 0,
  })
  const [showGtlCheckError, setShowGtlCheckError] = useState(false)
  const { updateNotification } = useContext(NotificationDispatchContext)

  useEffect(() => {
    getGroupEmployee()
    getCombiByGroup()
    getDirectorsInfo()
    return () => {
      setShowErrorDataModal(false)
    }
  }, [])

  useEffect(() => {
    if (employeeList.length === 0 || combinationData.length === 0) {
      return
    }
    var employeeWError = CheckErrorInUploadedMembers(
      employeeList,
      combinationData?.map((item) => item.rank),
    )
    let newErrorData = []
    employeeWError?.forEach((item) => {
      if (item.errorStatus?.length > 0) {
        newErrorData.push(item)
      }
      if (item.dependents && item.dependents.length > 0) {
        item.dependents.forEach((d) => {
          if (d.errorStatus?.length > 0) {
            newErrorData.push(d)
          }
        })
      }
    })
    if (newErrorData?.length > 0) {
      setErrorData(newErrorData)
      setShowErrorDataModal(true)
    } else {
      setErrorData([])
      setShowErrorDataModal(false)
    }
    calculateTotal(combinationData, [...employeeList])
  }, [employeeList, combinationData])

  const getDirectorsInfo = async () => {
    const result = await EmployeeGroupService.GetPersonByType('DIRECTOR', id)
    if (result.data?.length > 0) {
      setDirectorInfo(result.data)
      setHasDirectorInfo(true)
    }
  }

  const getGroupEmployee = async () => {
    let responseEmp = await EmployeeGroupService.GetPersonByType('EMPLOYEE', id)
    if (responseEmp.data?.length > 0) {
      responseEmp.data.forEach((element) => {
        element.citizen = element.nationality === 'MYS' ? 'MYS' : 'NonMYS'
        element.dateOfBirth_display = element.dateOfBirth ? moment(element.dateOfBirth, 'DD/MM/YYYY') : null
        element.visaExpiry_display = element.visaExpiry ? moment(element.visaExpiry) : null
        element.visaIssueDate_display = element.visaIssueDate ? moment(element.visaIssueDate) : null
        if (element.citizen === 'MYS') {
          element.age = getAgeFromNRIC(element.nric)
        } else {
          element.age = getAgeFromDoB(element.dateOfBirth)
        }
        element?.dependents.forEach((d) => {
          d.citizen = d.nationality === 'MYS' ? 'MYS' : 'NonMYS'
          d.dateOfBirth_display = d.dateOfBirth ? moment(d.dateOfBirth) : null
          d.visaExpiry_display = d.visaExpiry ? moment(d.visaExpiry) : null
          d.visaIssueDate_display = d.visaIssueDate ? moment(d.visaIssueDate) : null
        })
      })
      setEmployeeList(responseEmp.data)
    }
  }

  const calculateTotal = async (combiData, empData) => {
    var premium = []
    if (combiData.length > 0) {
      premium = await calculateTotalPremium(combiData, empData) // Wait for the promise to resolve
      const totalsst = premium.reduce((total, item) => total + Number(item.sst), 0)
      const totalMco = premium.reduce((sum, item) => sum + Number(item.totalMcoFee), 0)
      const totalWellness = premium.reduce((sum, item) => sum + Number(item.totalWellnessFee), 0)
      const totalStampDuty = premium && premium.length > 0 ? Number(premium[0].stampduty) : 0 // Convert to number
      const totalPremiumAll = premium.reduce((sum, item) => sum + Number(item.totalPremiumNettAll), 0)
      var totalPayable = parseFloat(totalPremiumAll) + parseFloat(totalMco) + parseFloat(totalWellness) + parseFloat(totalStampDuty) + parseFloat(totalsst)

      totalPayable = addThousandSeparator(parseFloat(totalPayable).toFixed(2))
      setCurrentRankCombi(totalPayable)
    }
  }

  const getCombiByGroup = async () => {
    const result = await BudgetService.GetCombiByEmpGroup(id)
    if (result.data?.length > 0) {
      setCombinationData(result.data.filter((item) => item.rank !== 0))
    }
  }

  const onChange = (val) => {
    setCurrentTab(val)
    calculateTotal(combinationData, [...employeeList])
  }

  const onOpenPurchaseDetailModal = () => {
    setShowPurchaseDetail(true)
  }

  const onUpdateDirector = () => {
    setShowDirectorModal(false)
    setHasDirectorInfo(true)

    getDirectorsInfo()
  }

  const onSubmit = async (data) => {
    if (!hasDirectorInfo) {
      updateNotification([
        {
          id: Math.random(),
          message: 'Please update Director Info!',
          types: 'error',
        },
      ])
      return
    }
    if (data && data.length < 5) {
      updateNotification([
        {
          id: Math.random(),
          message: 'Total employees must be greater than or equal to 5.',
          types: 'error',
        },
      ])
      return
    }

    let dataToCheck = []
    data
      ?.filter((item) => item.relationship.toLowerCase() === 'employee')
      ?.forEach((e) => {
        dataToCheck.push(e)
        if (e.dependents.length > 0) {
          dataToCheck = dataToCheck.concat(e.dependents)
        }
      })
    const recheckResult = CheckErrorInUploadedMembers(
      dataToCheck,
      combinationData?.map((item) => item.rank),
    )

    if (recheckResult?.some((item) => item.errorStatus?.length > 0)) {
      setErrorData(recheckResult.filter((item) => item.errorStatus?.length > 0))
      console.log('recheckResult', recheckResult)
      updateNotification([
        {
          id: Math.random(),
          message: 'There are still errors in employee data!',
          types: 'error',
        },
      ])
      return
    }

    const canProcessPayment = await EmployeeGroupService.CheckCanProcessPayment(id)
    if (canProcessPayment?.status === 200 && canProcessPayment.data?.canProcess) {
      navigate(`${PAGE_LINK.TERM_CONFIRMATION.NAME}/${id}`)
    } else {
      setShowGtlCheckError(true)
    }
  }

  const onRemoveGTL = async () => {
    try {
      const rs = await BudgetService.RemoveGTL(id)
      if (rs.status === 200) {
        navigate(`${PAGE_LINK.TERM_CONFIRMATION.NAME}/${id}`)
      }
    } catch (error) {
      updateNotification([
        {
          id: Math.random(),
          message: error?.response?.status === 400 ? error?.response?.data?.error : 'Error during execution!',
          types: 'error',
        },
      ])
    }
  }

  const onEditEmp = async (data) => {
    const currentItem = employeeList.find((item) => item.id === currentEmp.id)
    const newData = {
      ...currentItem,
      ...data,
      status: 1,
      nationality: data.citizen === 'MYS' ? 'MYS' : data.nationality,
    }
    newData.dependents.forEach((element) => {
      element.nationality = element.citizen === 'MYS' ? 'MYS' : element.nationality
    })
    if (newData.dependents?.length && newData.dependents[0].noDependent == 0) {
      newData.dependents = []
    }
    var result = await EmployeeGroupService.PutPersonDetails(newData)
    await getGroupEmployee()
    onClosePersonDetailModal()
  }

  const onClosePersonDetailModal = () => {
    setEditInfoModalState((prev) => {
      return { display: false, type: prev?.type }
    })
  }

  const onDeleteEmployee = async (deleteId) => {
    const result = await PersonService.DeletePerson(deleteId)
    if (result) {
      setEmployeeList((prev) => {
        return prev.filter((item) => item?.id !== deleteId)
      })
      await getGroupEmployee()
      setCurrentEmp(null)
    }
  }

  const hasDuplicateFields = async (field, value) => {
    if (currentEmp[`${field}`] === value || currentEmp?.dependents.some((d) => d[`${field}`] === value)) {
      return false
    }
    return employeeList?.some((e) => e[`${field}`] === value || e?.dependents?.some((d) => d[`${field}`] === value))
  }

  const confirmReupload = () => {
    setShowConfirmReuploadModal(true)
  }

  return (
    <Wrapper className="d-flex d-flex-c">
      <ChatIcon pageName="uploadFile" width={60} className="mb-5" />
      <div className=" text-white text-large mb-2">
        <b>Here is the summary of your employees list</b>
      </div>
      <div className=" text-white text-x-small">This is to generate the accurate pricing for your company</div>
      <StepProgressTrigger className="mb-4" />
      {errorData?.length > 0 && (
        <div className="d-flex background-primary text-x-small text-white border-round px-1 py-1 mb-2" onClick={() => setShowErrorDataModal(true)}>
          <ErrorIcon width={20}> </ErrorIcon>
          <div>Data uploading error.Please update.</div>
        </div>
      )}

      <Tabs
        className="upload-result-tab max-width-input"
        onChange={onChange}
        type="card"
        items={new Array(combinationData?.length).fill(null).map((_, i) => {
          const id = String(i + 1)
          return {
            label: <div className="text-x-small">Employee rank #{id}</div>,
            key: id,
            children: (
              <ContentWrapper key={i}>
                <ResultTabContent
                  data={employeeList?.filter((item) => item.rank?.toString() === id)}
                  onClickView={(emp) => {
                    setCurrentEmp(emp)
                    setShowInfoModal(true)
                  }}
                  onClickEdit={(emp) => {
                    setCurrentEmp(emp)
                    setEditInfoModalState({
                      display: true,
                      type: 0,
                    })
                  }}
                  onDeleteEmp={onDeleteEmployee}
                />
              </ContentWrapper>
            ),
          }
        })}
      />
      <TotalWrapper className="my-3 max-width-input w-90 text-white text-small text-left">Total Employees : {employeeList?.length} PAX</TotalWrapper>
      <Button
        className={`TuneTransparentButton text-width text-x-small`}
        style={{ minWidth: '100px', padding: '8px 4px', height: '30px', borderWidth: '1px' }}
        onClick={confirmReupload}
      >
        Change My Data
      </Button>
      <BottomWrapper>
        <UpdateDirectorWrapper className="text-x-small text-white" hasDirectorInfo={hasDirectorInfo}>
          {hasDirectorInfo ? (
            <>
              <InfoSuccessIconWrapper />
              <div>
                Director's detail is updated. Click to{' '}
                <a className="text-white text-underline" onClick={() => setShowDirectorModal(true)}>
                  VIEW
                </a>
              </div>
            </>
          ) : (
            <>
              <IconWrapper />
              <div>
                You have yet update your director's detail. Please{' '}
                <a className="text-white text-underline" onClick={() => setShowDirectorModal(true)}>
                  UPDATE
                </a>
              </div>
            </>
          )}
        </UpdateDirectorWrapper>
        <div className="d-flex background-primary pb-1 center-items">
          <BottomButtonWrapper className="d-flex max-width-input w-100">
            <Col className="d-flex d-flex-c text-white" span={10}>
              <div>
                <span></span>RM <span className="text-xxx-large">{currentRankCombi}</span>
              </div>
              <div className="text-x-small">
                Total Payable <UpOutlined onClick={() => onOpenPurchaseDetailModal()} className="text-large cursor-pointer" />
              </div>
            </Col>
            <Col span={14}>
              <Button className={hasDirectorInfo ? 'TuneWhiteButton' : 'TuneLightPrimaryButton'} onClick={() => onSubmit(employeeList)}>
                NEXT
              </Button>
            </Col>
          </BottomButtonWrapper>
        </div>
      </BottomWrapper>
      <PurchaseDetailModal data={employeeList} show={showPurchaseDetail} setShow={setShowPurchaseDetail} combiData={combinationData} />
      <DirectorDetailModal onSubmit={onUpdateDirector} show={showDirectorModal} setShow={setShowDirectorModal} directorsInfo={directorInfo} />
      <PersonInfoModal
        isShow={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        data={currentEmp}
        onEdit={() => {
          setShowInfoModal(false)
          setEditInfoModalState({
            display: true,
            type: 0,
          })
        }}
      />
      <PersonDetailModal
        data={editInfoModalState}
        onClose={onClosePersonDetailModal}
        onAddNewEmp={null}
        onEditEmp={onEditEmp}
        empData={currentEmp}
        underwritingQuestion={employeeList?.length >= 5 && employeeList?.length <= 10}
        hasDuplicateFields={hasDuplicateFields}
      />
      <NotificationModal
        isVisible={showErrorDataModal}
        title={
          <div className="text-small text-bold">
            The following data requires your attention.
            <br />
            Please update the data accordingly.
          </div>
        }
        buttonText="OK"
        buttonClass={'TunePrimaryButton'}
        onClose={() => setShowErrorDataModal(false)}
        className="upload-result-error w-90 max-width-input"
        content={<Table className="tune-error-table" columns={ERROR_COLUMNS} dataSource={errorData} pagination={false} />}
      />

      <ConfirmModal
        isVisible={showGtlCheckError}
        cancelText={'Update employee'}
        okText="Remove GTL"
        confirmation="Cannot process due to fail Premium check"
        title="Error: Premium check fail"
        icon={<WarningOutlined style={{ fontSize: '40px' }} className="text-primary" />}
        onCancel={() => setShowGtlCheckError(false)}
        onSubmit={onRemoveGTL}
        onclose={() => setShowGtlCheckError(false)}
      />
      <ConfirmModal
        isVisible={showConfirmReuploadModal}
        cancelText={'Yes, change my data'}
        okText="No, keep my data"
        confirmation="Do you confirm to change old data with new one?"
        title={<span>Note: New data will erase the old data that you provided earlier</span>}
        icon={<WarningOutlined style={{ fontSize: '40px' }} className="text-primary" />}
        onSubmit={() => setShowConfirmReuploadModal(false)}
        onCancel={() => navigate(PAGE_LINK.EMPLOYEE_PROVIDER.NAME + '/' + id)}
        onclose={() => setShowConfirmReuploadModal(false)}
        okStyle={{ padding: '12px' }}
        cancelStyle={{ padding: '12px' }}
      />
    </Wrapper>
  )
}

const ERROR_COLUMNS = [
  {
    title: (
      <div>
        Name <span className="text-primary">&#x2022; attention(s) required</span>
      </div>
    ),
    dataIndex: 'name',
    key: 'name',
    render: (data, row, rowIndex) => {
      return (
        <>
          <div className="text-bold">
            {rowIndex + 1}. {data}
          </div>
          <ul className="pl-5">
            {row?.errorStatus?.map((item, index) => (
              <li className="text-x-small text-italic" style={{ color: 'red' }} key={index}>
                {item?.error?.SHORT}
              </li>
            ))}
          </ul>
        </>
      )
    },
  },
  {
    title: 'Ranks',
    dataIndex: 'rank',
    key: 'rank',
    align: 'center',
  },
]

export default UploadExcelResult
