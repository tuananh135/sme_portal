import { Button, Col, Image, Row, Tabs } from 'antd'
import { Children, useEffect, useState } from 'react'
import styled from 'styled-components'
import ChatIcon from 'common/components/ChatIcon/ChatIcon'
import { useNavigate, useParams } from 'react-router-dom'
import { CopyFilled } from '@ant-design/icons'
import DynamicAddTag from 'common/components/Tag/DynamicAddTag'
import SubmitQuestionModal from 'common/components/Modal/SubmitQuestionModal'
import { PAGE_INDEX } from 'common/constants/pagination'
import { PAGE_LINK } from 'common/constants/pagelinks'
import { REGEX } from 'common/constants/constants'
import PrimaryButton from 'common/components/Button/PrimaryButton'
import { BudgetService } from 'services/B2CService/BudgetService'
import StepProgressTrigger from 'common/components/StepPanel/StepProgressTrigger'

//#region Custom theme
const RowCenter = styled(Row)`
  margin: auto;
`
const BodyContent = styled.div`
  color: white;
  text-align: center;
  font-size: larger;
  opacity: 0.9;
`
const TabCustom = styled(Tabs)`
  min-height: 35vh;
  .ant-tabs-nav {
    margin-bottom: 0px !important;
  }

  .ant-tabs-tab {
    justify-content: center;
    padding: 5px 8px !important;
    border-radius: 5px 5px 0px 0px !important;
    color: #ffffffbd;
    background-color: transparent !important;
    margin-left: 0px !important;
    border: 0px !important;
  }

  .ant-tabs-tab-btn {
    font-size: 65%;
  }

  .ant-tabs-tab-active {
    background-color: white !important;
    .ant-tabs-tab-btn {
      color: red !important;
    }
  }

  .ant-tabs-content-holder {
    background-color: white;
  }
`
//#endregion

export default function InputEmailAddress() {
  const [showQuestion, setShowQuestion] = useState(false)
  const [employeeEmails, setEmployeeEmails] = useState([])
  const [currentRank, setCurrentRank] = useState(1)
  const [rankList, setRankList] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()

  const conditionCheckEmail = (text) => {
    return REGEX.EMAIL.test(text)
  }

  const pasteFromClipboard = async (rank) => {
    var text = await navigator.clipboard.readText()
    if (text?.length <= 0) return
    var emails = text?.replaceAll(' ', '')?.split(';')
    emails = emails.filter((item) => !employeeEmails.find((i) => i.email === item))
    var emailData = emails.filter((item) => conditionCheckEmail(item)).map((email) => ({ email: email, rank: currentRank }))
    setEmployeeEmails((prev) => prev.concat(emailData))
  }

  useEffect(() => {}, [])

  useEffect(() => {
    getCombiByGroup()
  }, [])

  const getCombiByGroup = async () => {
    const result = await BudgetService.GetCombiByEmpGroup(id)
    if (result.data?.length > 0) {
      setRankList(result.data.filter((item) => item.rank !== 0))
    }
  }

  return (
    <BodyContent>
      <ChatIcon pageName="SelfCompleteEmp" width={50} />
      <Row
        style={{
          justifyContent: 'center',
          margin: '1vh 5vw 0vh 5vw',
          lineHeight: 'normal',
        }}
      >
        Paste an employee email or use Paste from clipboard button below
      </Row>
      <Row style={{ justifyContent: 'center', margin: '1vh 10vw 3vh 10vw' }}>
        <div style={{ fontSize: '60%' }}>This is to generate the accurate pricing for your company.</div>
      </Row>
      <StepProgressTrigger />
      <Row style={{ margin: '0vh 5vw 0vh 5vw' }}>
        <Col className="self-center" style={{ width: '100%', maxWidth: '1000px' }}>
          <TabCustom
            defaultActiveKey="1"
            type="card"
            className="self-upload-tab"
            onChange={(val) => {
              setCurrentRank(val)
            }}
            tabPosition={'top'}
            renderTabBar={(props, TabNavList) => <TabNavList {...props} mobile={false} />}
            items={new Array(rankList.length).fill(null).map((_, index) => {
              const id = String(index + 1)
              return {
                label: `Employee Rank #${id}`,
                key: id,
                children: (
                  <div className="d-flex-c h-50">
                    <DynamicAddTag
                      employeeEmails={employeeEmails}
                      setEmployeeEmails={setEmployeeEmails}
                      maxLength={30}
                      condition={conditionCheckEmail}
                      currentRank={index + 1}
                    ></DynamicAddTag>
                    <RowCenter
                      onClick={() => pasteFromClipboard(index + 1)}
                      style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: employeeEmails.filter((item) => item.rank === index + 1)?.length > 0 ? 'none' : 'block',
                      }}
                    >
                      <CopyFilled style={{ color: '#ec5a54', display: 'block' }} />
                      paste from clipboard
                    </RowCenter>
                  </div>
                ),
              }
            })}
          ></TabCustom>

          <div className="text-left text-small mt-3">Total Employee: {employeeEmails.length > 0 ? `${employeeEmails.length}pax` : ''}</div>
        </Col>
      </Row>
      <Row style={{ margin: '3vh 0vw 4vh 0vw', justifyContent: 'center' }}>
        <Col span={12}>
          <PrimaryButton
            rootclass="max-width-input"
            text={'Next'}
            disabled={employeeEmails.length === 0}
            onClick={() => navigate(`${PAGE_LINK.PURCHASE_SUMMARY.NAME}/${id}`, { state: { emails: employeeEmails } })}
          ></PrimaryButton>
        </Col>
      </Row>

      <SubmitQuestionModal show={showQuestion} setShow={setShowQuestion}></SubmitQuestionModal>
    </BodyContent>
  )
}
