import React, { useEffect, useState } from 'react'
import logo from 'assets/images/logo.png'
import { Button, Col, Image, Modal, Row, Tooltip } from 'antd'
import PurchaseDetailEmpRank from '../EmpRankWithTickInfo/PurchaseDetailEmpRank'
import styled from 'styled-components'
import { SaveOutlined } from '@ant-design/icons'
import moment from 'moment'
import SaveQuoteModal from 'common/components/Modal/SaveQuoteModal'
import { get_StampDuty, calculateTotalPremium } from 'common/constants/budgetConstant'
import { addThousandSeparator } from 'common/utils/stringUtils'
import { ReactComponent as RedInfoIcon } from 'assets/images/icon-info.svg'
import { ReactComponent as InfoIcon } from 'assets/images/icon-info-white.svg'

const BottomWrapper = styled.div`
  width: 100%;
  max-width: 540px;
  position: absolute;
  bottom: 0;
`

const BottomButtonWrapper = styled.div`
  justify-content: start;
  align-items: flex-start;
  width: 100%;
`

const SaveQuoteWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #414349;
  width: 100%;
  padding: 4px;
`

const HeaderWrapper = styled.div`
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 500px;
`

const TotalWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  border-top: 1px solid white;
`

const Body = styled.div`
  overflow-y: auto;
  height: 78vh;
`

function PurchaseDetailModal({ data, show, setShow, combiData = [] }) {
  const [isShowQuoteModal, setIsShowQuoteModal] = useState(false)
  const [premiumData, setPremiumData] = useState([])
  const [totalDependents, setTotalDependents] = useState(0) // Define totalDependents state variable
  const [totalEmployees, setTotalEmployee] = useState(0)
  const [totalEmployeeOnly, setTotalEmployeeOnly] = useState(0)
  const [totalEmployeeAndFamily, setTotalEmployeeFamily] = useState(0)
  const [totalEmployeePlus, setTotalEmployeePlus] = useState(0)
  const [totalPayableFormatted, setTotalPayableFormatted] = useState(0)
  const [sstString, setSstString] = useState(null)
  const [mcoString, setMCOString] = useState(null)
  const [stampDutyString, setStampDutyString] = useState(null)
  const [wellnessString, setWellnessString] = useState(null)

  const hideModal = () => {
    setShow(false)
  }

  const calculateTotal = async (combiData, data) => {
    var values = []
    if (combiData.length > 0) {
      values = await calculateTotalPremium(combiData, data)
    }
    return values
  }

  useEffect(() => {
    async function calculateAndProcessTotal() {
      const premium = await calculateTotal(combiData, data) // Wait for the calculation to complete
      if (premium.length === 0) return
      setPremiumData(premium)
      const totalDependents = premium.reduce((total, value) => total + value.totaldependent, 0)
      setTotalDependents(totalDependents)
      const totalEmployees = premium.reduce((total, value) => total + value.totalEmp, 0)
      setTotalEmployee(totalEmployees)
      const employeeOnlyCount = premium.reduce((total, value) => total + value.totalEmpWithOutDep, 0)
      setTotalEmployeeOnly(employeeOnlyCount)
      const employeeWithFamily = premium.reduce((total, value) => total + value.totalEmpWithFamily, 0)
      setTotalEmployeeFamily(employeeWithFamily)
      const employeePlus = premium.reduce((total, value) => total + value.totalEmpPlus, 0)
      setTotalEmployeePlus(employeePlus)
      let totalsst = premium.reduce((total, item) => total + Number(item.sst), 0)
      totalsst = totalsst.toFixed(2)
      const totalMco = premium.reduce((sum, item) => sum + Number(item.totalMcoFee), 0)
      const totalWellness = premium.reduce((sum, item) => sum + Number(item.totalWellnessFee), 0)
      const totalStampDuty = premium && premium.length > 0 ? premium[0].stampduty : 0

      const totalPremiumAll = premium.reduce((sum, item) => sum + Number(item.totalPremiumNettAll), 0)
      const totalPayable = parseFloat(totalPremiumAll) + parseFloat(totalMco) + parseFloat(totalWellness) + parseFloat(totalStampDuty) + parseFloat(totalsst)

      const totalPayableFormatted = addThousandSeparator(totalPayable.toFixed(2))
      setTotalPayableFormatted(totalPayableFormatted)
      const mcoString = addThousandSeparator(totalMco)
      setMCOString(mcoString)
      const wellnessString = addThousandSeparator(totalWellness)
      setWellnessString(wellnessString)
      const stampDutyString = addThousandSeparator(totalStampDuty)
      setStampDutyString(stampDutyString)
      const sstString = addThousandSeparator(totalsst)
      setSstString(sstString)
    }

    calculateAndProcessTotal()
  }, [combiData, data])

  return (
    <Modal open={show} onOk={hideModal} onCancel={hideModal} okText="Ok" cancelText="Cancel" className="purchase-detail text-white d-flex" footer={null}>
      <HeaderWrapper className="d-flex mb-2">
        <Image src={logo} width={50} />
        <div className="text-x-small">{moment(Date.now()).format('yyyy/MM/DD')}</div>
      </HeaderWrapper>
      <Body className="scroll-bar">
        {combiData?.map((item, index) => (
          <PurchaseDetailEmpRank item={item} key={index} employee={data.filter((e) => e.rank === item.rank)} />
        ))}

        <TotalWrapper className="text-x-small pt-3">
          {premiumData &&
            premiumData.length > 0 &&
            premiumData.map((value, index) => (
              <React.Fragment key={index}>
                <div>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <span>Premium After Rebate (Rank {index + 1})</span>
                  </Row>
                </div>
                {value?.totalEmpWithOutDep > 0 && (
                  <div>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <span style={{ marginLeft: '16px' }}>
                        Employee Only ( RM {addThousandSeparator(value.premiumNettEmployee)} X {value.totalEmpWithOutDep}){' '}
                        <Tooltip
                          placement="topRight"
                          title={
                            <div>
                              <RedInfoIcon height={10} width={10} /> Premium price for {value.totalEmpWithOutDep} employee(s)
                            </div>
                          }
                          color={'#fff'}
                          showArrow={false}
                          overlayClassName="text-x-small budget-offer-tooltip"
                          overlayInnerStyle={{ color: 'black' }}
                        >
                          <InfoIcon height={10} width={10} />
                        </Tooltip>{' '}
                      </span>
                      <span>RM {addThousandSeparator(value.totalPremiumNettEmployee)}</span>
                    </Row>
                  </div>
                )}

                {value?.totalEmpPlus > 0 && (
                  <div>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <span style={{ marginLeft: '16px' }}>
                        Employee And Spouse/Child (RM {addThousandSeparator(value.premiumNettEmployeePlus)} X {value.totalEmpPlus}){' '}
                        <Tooltip
                          placement="topRight"
                          title={
                            <div>
                              <RedInfoIcon height={10} width={10} /> Premium price for {value.totalEmpPlus} employee(s) with spouse or children only{' '}
                            </div>
                          }
                          color={'#fff'}
                          showArrow={false}
                          overlayClassName="text-x-small budget-offer-tooltip"
                          overlayInnerStyle={{ color: 'black' }}
                        >
                          <InfoIcon height={10} width={10} />
                        </Tooltip>{' '}
                      </span>
                      <span>RM {addThousandSeparator(value.totalPremiumNettEmployeePlus)}</span>
                    </Row>
                  </div>
                )}

                {value?.totalEmpWithFamily > 0 && (
                  <div>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <span style={{ marginLeft: '16px' }}>
                        Employee And Family (RM {addThousandSeparator(value.premiumNettFamily)} X {value.totalEmpWithFamily}){' '}
                        <Tooltip
                          placement="topRight"
                          title={
                            <div>
                              <RedInfoIcon height={10} width={10} /> Premium price for {value.totalEmpWithFamily} employee(s) with family{' '}
                            </div>
                          }
                          color={'#fff'}
                          showArrow={false}
                          overlayClassName="text-x-small budget-offer-tooltip"
                          overlayInnerStyle={{ color: 'black' }}
                        >
                          <InfoIcon height={10} width={10} />
                        </Tooltip>{' '}
                      </span>
                      <span>RM {addThousandSeparator(value.totalPremiumNettFamily)}</span>
                    </Row>
                  </div>
                )}
                <br />
              </React.Fragment>
            ))}
          {premiumData && premiumData.length > 0 && (
            <>
              <Row style={{ justifyContent: 'space-between' }}>
                <span>
                  Managed Care Organisation (MCO) Fees (RM {premiumData[0]?.mcoFees} X {totalDependents + totalEmployees}){' '}
                  <Tooltip
                    placement="topRight"
                    title={
                      <div>
                        <RedInfoIcon height={10} width={10} /> MCO fees for {totalEmployees} employee(s) and {totalDependents} dependent(s){' '}
                      </div>
                    }
                    color={'#fff'}
                    showArrow={false}
                    overlayClassName="text-x-small budget-offer-tooltip"
                    overlayInnerStyle={{ color: 'black' }}
                  >
                    <InfoIcon height={10} width={10} />
                  </Tooltip>{' '}
                </span>
                <span>RM {mcoString}</span>
              </Row>

              <Row style={{ justifyContent: 'space-between' }}>
                <span>
                  Wellness Fees (RM {premiumData[0]?.wellnessFee} X {data?.length}){' '}
                  <Tooltip
                    placement="topRight"
                    title={
                      <div>
                        <RedInfoIcon height={10} width={10} /> Wellness fees for {totalEmployees} employee(s).
                      </div>
                    }
                    color={'#fff'}
                    showArrow={false}
                    overlayClassName="text-x-small budget-offer-tooltip"
                    overlayInnerStyle={{ color: 'black' }}
                  >
                    <InfoIcon height={10} width={10} />
                  </Tooltip>{' '}
                </span>
                <span>RM {wellnessString}</span>
              </Row>

              <Row style={{ justifyContent: 'space-between' }}>
                <span>Stamp Duty</span>
                <span>RM {stampDutyString}</span>
              </Row>

              <Row style={{ justifyContent: 'space-between' }}>
                <span>
                  SST{' '}
                  <Tooltip
                    placement="topRight"
                    title={
                      <div>
                        <RedInfoIcon height={10} width={10} /> 6% of total Premium After Rebate
                      </div>
                    }
                    color={'#fff'}
                    showArrow={false}
                    overlayClassName="text-x-small budget-offer-tooltip"
                    overlayInnerStyle={{ color: 'black' }}
                  >
                    <InfoIcon height={10} width={10} />
                  </Tooltip>{' '}
                </span>
                <span>RM {sstString}</span>
              </Row>
            </>
          )}
        </TotalWrapper>
      </Body>

      <BottomWrapper>
        <SaveQuoteWrapper className="text-x-small text-white">
          <div className="w-90 center-items-y">
            <div>TOTAL EMPLOYEE : {data?.length}</div>
          </div>
        </SaveQuoteWrapper>
        <SaveQuoteWrapper className="text-x-small text-white">
          <div className="w-90 center-items-y">
            <div>TOTAL DEPENDENTS : {totalDependents}</div>
          </div>
        </SaveQuoteWrapper>
        <BottomButtonWrapper className="d-flex text-white background-primary pb-1 center-items">
          <div className="w-90 center-items-cx" style={{ alignItems: 'start' }}>
            <div>
              RM<span className="text-xxx-large">{totalPayableFormatted}</span>
            </div>
            <div className="text-x-small">Total Payable</div>
          </div>
        </BottomButtonWrapper>
      </BottomWrapper>

      <SaveQuoteModal show={isShowQuoteModal} setShow={setIsShowQuoteModal} />
    </Modal>
  )
}

export default PurchaseDetailModal
