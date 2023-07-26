import { Button, Col, Tabs } from 'antd'
import ChatIcon from 'common/components/ChatIcon/ChatIcon'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import ResultTabContent from './components/ResultTabContent'
import { ReactComponent as InfoIcon } from 'assets/images/icon-info-white.svg'
import { ReactComponent as InfoSuccessIcon } from 'assets/images/icon-info-success.svg'
import { PlusCircleOutlined, SyncOutlined, UpOutlined, WarningOutlined } from '@ant-design/icons'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import DirectorDetailModal from 'pages/DirectorDetail/DirectorDetailModal'
import PurchaseDetailModal from 'common/components/Modal/PurchaseDetailModal'
import ConfirmModal from 'common/components/Modal/ConfirmModal'
import { PAGE_LINK } from 'common/constants/pagelinks'
import PersonDetailModal from 'pages/PersonDetail/PersonDetailModal'
import PersonInfoModal from 'pages/PersonDetail/PersonInfoModal'
import { EmployeeGroupService } from 'services/B2CService/EmployeeGroupService'
import { BudgetService } from 'services/B2CService/BudgetService'
import { PersonService } from 'services/B2CService/PersonService'
import { NotificationDispatchContext } from 'contexts/NotificationContext'
import { get_StampDuty, calculateTotalPremium } from 'common/constants/budgetConstant'
import { addThousandSeparator } from 'common/utils/stringUtils'
import moment from 'moment'
import { FRIENDLY_MESSAGE } from 'common/constants/constants'
import { UWStatus, checkHealthQuestionsPassed } from 'common/utils/healthQuestionUtil'
import StepProgressTrigger from 'common/components/StepPanel/StepProgressTrigger'

const Wrapper = styled.div`
  align-items: center;
  text-align: center;
  justify-content: center;
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

const IconSuccessWrapper = styled(InfoSuccessIcon)`
  position: relative;
  bottom: 15px;
`

const BottomButtonWrapper = styled.div`
  justify-content: space-around;
  align-items: center;
`

function SelfCompleteEmployeeResult() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [currentItemId, setCurrentItemId] = useState(null)
  const [currentTab, setCurrentTab] = useState(1)
  const [employeeList, setEmployeeList] = useState([])
  const [showPurchaseDetail, setShowPurchaseDetail] = useState(false)
  const [showDirectorModal, setShowDirectorModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [editInfoModalState, setEditInfoModalState] = useState({
    display: false,
    type: 0,
  }) // type 0 edit, type 1 add
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [hasDirectorInfo, setHasDirectorInfo] = useState(false)
  const [directorInfo, setDirectorInfo] = useState(null)
  const [combinationData, setCombinationData] = useState([])
  const [currentRankCombi, setCurrentRankCombi] = useState(null)
  const [showGtlCheckError, setShowGtlCheckError] = useState(false)
  const { updateNotification } = useContext(NotificationDispatchContext)
  const [totalPayable, setTotalPayable] = useState(null)
  const [showConfirmReuploadModal, setShowConfirmReuploadModal] = useState(false)

  useEffect(() => {
    getCombiByGroup()
    getPerson()
  }, [])

  useEffect(() => {
    calculateTotal()
  }, [employeeList])

  const getCombiByGroup = async () => {
    const result = await BudgetService.GetCombiByEmpGroup(id)
    if (result.data?.length > 0) {
      setCombinationData(result.data.filter((item) => item.rank !== 0))
      setCurrentRankCombi(result.data?.find((item) => item.rank === currentTab)?.budgetBasedData?.totalPremiumPayableNett)
    }
  }
  async function getPerson() {
    let response = await EmployeeGroupService.GetPersonByType('DIRECTOR', id)
    let responseEmp = await EmployeeGroupService.GetPersonByType('EMPLOYEE', id)
    if (responseEmp.data?.length > 0) {
      responseEmp.data.forEach((element) => {
        element.citizen = element.nationality === 'MYS' ? 'MYS' : 'NonMYS'
        element.dateOfBirth_display = element.dateOfBirth ? moment(element.dateOfBirth, 'DD/MM/YYYY') : null
        element.visaExpiry_display = element.visaExpiry ? moment(element.visaExpiry) : null
        element.visaIssueDate_display = element.visaIssueDate ? moment(element.visaIssueDate) : null
        element?.dependents.forEach((d) => {
          d.citizen = d.nationality === 'MYS' ? 'MYS' : 'NonMYS'
          d.dateOfBirth_display = d.dateOfBirth ? moment(d.dateOfBirth) : null
          d.visaExpiry_display = d.visaExpiry ? moment(d.visaExpiry) : null
          d.visaIssueDate_display = d.visaIssueDate ? moment(d.visaIssueDate) : null
        })
      })
      setEmployeeList(responseEmp.data)
    }
    response.data?.length > 0 && setDirectorInfo(response.data)
  }
  const onOpenPurchaseDetailModal = () => {
    setShowPurchaseDetail(true)
  }

  const onUpdateDirector = () => {
    setShowDirectorModal(false)
    setHasDirectorInfo(true)
    getPerson()
  }

  const calculateTotal = async () => {
    var premium = []
    if (combinationData?.length > 0 && employeeList?.length > 0) {
      premium = await calculateTotalPremium(combinationData, employeeList) // Wait for the promise to resolve
      const totalsst = premium.reduce((total, item) => total + Number(item.sst), 0)
      const totalMco = premium.reduce((sum, item) => sum + Number(item.totalMcoFee), 0)
      const totalWellness = premium.reduce((sum, item) => sum + Number(item.totalWellnessFee), 0)
      const totalStampDuty = premium && premium.length > 0 ? Number(premium[0].stampduty) : 0 // Convert to number
      const totalPremiumAll = premium.reduce((sum, item) => sum + Number(item.totalPremiumNettAll), 0)
      var totalPayable = parseFloat(totalPremiumAll) + parseFloat(totalMco) + parseFloat(totalWellness) + parseFloat(totalStampDuty) + parseFloat(totalsst)

      totalPayable = addThousandSeparator(parseFloat(totalPayable).toFixed(2))
      setTotalPayable(totalPayable)
      return totalPayable
    }
  }

  let isDisabled = false
  employeeList.forEach((employee) => {
    if (employee.status === 0) {
      isDisabled = true
      return false // break out of the loop
    }
  })

  const onOpenPersonDetailModal = (type = 1) => {
    setEditInfoModalState({ display: true, type: type })
  }

  const onClosePersonDetailModal = () => {
    setEditInfoModalState((prev) => {
      return { display: false, type: prev?.type }
    })
  }

  const onEditEmp = async (data) => {
    const currentItem = employeeList.find((item) => item.id === currentItemId)
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
    if (result) {
      setEditInfoModalState((prev) => {
        return { display: false, type: prev?.type }
      })
      var indexOfNewItem = employeeList.findIndex((item) => item.id === newData.id)
      var copyList = [...employeeList]
      copyList[indexOfNewItem] = newData
      setEmployeeList(copyList)
    }
  }

  const onAddNewEmp = async (value) => {
    value.rank = currentTab
    if (value.dependents?.length && value.dependents[0].noDependent == 0) {
      value.dependents = []
    }
    value.dependents.forEach((element) => {
      element.nationality = element.citizen === 'MYS' ? 'MYS' : element.nationality
    })
    var result = await EmployeeGroupService.PostPersonDetails([
      {
        ...value,
        groupId: id,
        nationality: value.citizen === 'MYS' ? 'MYS' : value.nationality,
      },
    ])
    if (result?.status === 200) {
      setEmployeeList((prev) => {
        return [
          ...prev,
          {
            ...value,
          },
        ]
      })
      setEditInfoModalState((prev) => {
        return { display: false, type: prev?.type }
      })
    }
  }

  const onDeleteEmployee = async (deleteId) => {
    const result = await PersonService.DeletePerson(deleteId)
    if (result) {
      setEmployeeList((prev) => {
        return prev.filter((item) => item?.id !== deleteId)
      })
      setShowWarningModal(false)
      setCurrentItemId(null)
    }
  }

  const onResendQR = async () => {
    const currentEmp = employeeList.find((item) => item.id === currentItemId)
    if (!currentEmp) {
      return
    }
    await EmployeeGroupService.ResendInvitation(
      [
        {
          email: currentEmp.email,
          rank: currentEmp.rank,
          personID: currentItemId,
        },
      ],
      id,
    )
  }

  const onShowWarningModal = (deleteId) => {
    setCurrentItemId(deleteId)
    setShowWarningModal(true)
  }

  const onClickNext = async () => {
    if (employeeList && employeeList.length < 5) {
      updateNotification([
        {
          id: Math.random(),
          message: 'Total employees must be greater than or equal to 5',
          types: 'error',
        },
      ])
      return
    }

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

    if (employeeList.length >= 5 && employeeList.length <= 10) {
      for (let i = 0; i < employeeList.length; i++) {
        const result = checkHealthQuestionsPassed(employeeList[i])
        if (result != UWStatus.PASSED) {
          updateNotification([
            {
              id: Math.random(),
              message: FRIENDLY_MESSAGE[result],
              types: 'error',
            },
          ])
          return
        }
      }
    }

    var canProcessPayment = await EmployeeGroupService.CheckCanProcessPayment(id)
    if (canProcessPayment?.status === 200 && canProcessPayment.data?.canProcess) {
      directorInfo?.length > 0 && navigate(`${PAGE_LINK.TERM_CONFIRMATION.NAME}/${id}`)
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

  const hasDuplicateFields = async (field, value) => {
    return await PersonService.CheckEmployeeNotExist(value, field, id)
  }

  const confirmReupload = () => {
    setShowConfirmReuploadModal(true)
  }

  return (
    <Wrapper className="d-flex d-flex-c center-items">
      <div className="d-flex d-flex-c center-items">
        <ChatIcon width={60} className="mb-5" />
        <div className=" text-white text-large mb-2 w-90">Let's get your employee complete their Personal details within 7 days.</div>
        <div className=" text-white text-x-small w-90">This is to generate the accurate pricing for your company</div>
        <StepProgressTrigger className="mb-5" />
      </div>

      <div style={{ marginBottom: '100px' }} className="w-100 d-flex d-flex-c center-items">
        <Tabs
          className="self-upload-result-tab max-width-input"
          type="card"
          onChange={(val) => {
            setCurrentTab(val)
            setCurrentRankCombi(combinationData?.find((item) => item.rank == val)?.budgetBasedData?.totalPremiumPayableNett)
          }}
          renderTabBar={(props, TabNavList) => <TabNavList {...props} mobile={false} />}
          items={new Array(combinationData?.filter((item) => item.rank !== 0).length).fill(null).map((_, i) => {
            const id = String(i + 1)
            return {
              label: <div className="text-small">Employee Rank #{id}</div>,
              key: id,
              children: (
                <div>
                  <ResultTabContent
                    data={employeeList?.filter((item) => item.rank == id)}
                    onOpenPersonDetailModal={onOpenPersonDetailModal}
                    onDeleteEmployee={onDeleteEmployee}
                    onResendQR={onResendQR}
                    onShowWarningModal={onShowWarningModal}
                    currentItemHandler={[currentItemId, setCurrentItemId]}
                    setShowInfoModal={setShowInfoModal}
                  />
                </div>
              ),
            }
          })}
        />
        <Button
          onClick={() => {
            setCurrentItemId(null)

            setEditInfoModalState((prev) => {
              return { type: 1, display: true }
            })
          }}
          className="TuneAddDirectorButton mt-5"
          style={{ margin: '12px auto' }}
        >
          Add more employees
          <PlusCircleOutlined color="white" />
        </Button>
        <Button
          className={`TuneTransparentButton text-width text-x-small`}
          style={{ minWidth: '100px', padding: '8px 4px', height: '30px', borderWidth: '1px' }}
          onClick={confirmReupload}
        >
          Change My Data
          <SyncOutlined />
        </Button>
      </div>

      <BottomWrapper>
        <UpdateDirectorWrapper className="text-x-small text-white" hasDirectorInfo={hasDirectorInfo || directorInfo?.length > 0}>
          {directorInfo?.length > 0 ? (
            <>
              <IconSuccessWrapper />
              <div>
                <div>
                  Director's detail is updated. Click to{' '}
                  <a className="text-white text-underline" onClick={() => setShowDirectorModal(true)}>
                    VIEW
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              <IconWrapper />
              <div>
                <div>
                  You have yet to update your director(s) detail. Please{' '}
                  <a className="text-white text-underline" onClick={() => setShowDirectorModal(true)}>
                    UPDATE
                  </a>
                </div>{' '}
              </div>
            </>
          )}
        </UpdateDirectorWrapper>
        <div className="d-flex background-primary pb-1 center-items">
          <BottomButtonWrapper className="d-flex max-width-input w-100">
            <Col className="d-flex d-flex-c text-white" span={10}>
              <div>
                <span></span>RM <span className="text-xxx-large">{totalPayable}</span>
              </div>
              <div className="text-x-small">
                x {employeeList?.filter((item) => item)?.length} Employees <UpOutlined onClick={() => onOpenPurchaseDetailModal()} className="text-large cursor-pointer" />
              </div>
            </Col>
            <Col span={14}>
              <Button className={hasDirectorInfo || directorInfo?.length > 0 ? 'TuneWhiteButton' : 'TuneLightPrimaryButton'} onClick={onClickNext} disabled={isDisabled}>
                NEXT
              </Button>
            </Col>
          </BottomButtonWrapper>
        </div>
      </BottomWrapper>
      <PurchaseDetailModal data={employeeList} combiData={combinationData} show={showPurchaseDetail} setShow={setShowPurchaseDetail} />
      <DirectorDetailModal onSubmit={onUpdateDirector} show={showDirectorModal} setShow={setShowDirectorModal} directorsInfo={directorInfo} />
      <PersonDetailModal
        data={editInfoModalState}
        onClose={onClosePersonDetailModal}
        onAddNewEmp={onAddNewEmp}
        onEditEmp={onEditEmp}
        empData={employeeList?.find((item) => item.id === currentItemId)}
        underwritingQuestion={employeeList.length >= 5 && employeeList.length <= 10}
        hasDuplicateFields={hasDuplicateFields}
      />
      <PersonInfoModal
        isShow={showInfoModal}
        onEdit={() => {
          setShowInfoModal(false)
          setEditInfoModalState((prev) => {
            return { ...prev, display: true }
          })
        }}
        onClose={() => setShowInfoModal(false)}
        data={employeeList?.find((item) => item.id === currentItemId)}
      />
      <ConfirmModal
        isVisible={showWarningModal}
        cancelText={'Remove this employee'}
        okText="Contact Us"
        confirmation={
          <span>
            Please contact us at <u className="text-primary">hello.tpv@tuneprotect.com</u> for help.
          </span>
        }
        title="Error: This employee have exceed the age of eligibility"
        icon={<WarningOutlined style={{ fontSize: '40px' }} className="text-primary" />}
        onCancel={() => onDeleteEmployee(currentItemId)}
        onSubmit={() => console.log('contact us')}
        onclose={() => setShowWarningModal(false)}
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

export default SelfCompleteEmployeeResult
