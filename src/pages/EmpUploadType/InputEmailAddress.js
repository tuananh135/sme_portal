import { Button, Col, Image, Row, Tabs } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import chatImage from 'assets/images/nina-small.png'
import { useNavigate } from 'react-router-dom'
import { CopyFilled } from '@ant-design/icons'
import DynamicAddTag from 'common/components/Tag/DynamicAddTag'
import SubmitQuestionModal from 'common/components/Modal/SubmitQuestionModal'
import { PAGE_LINK } from 'common/constants/pagelinks'

//#region Custom theme
const RowCenter = styled(Row)`
  text-align: center;
  justify-content: center;
`;
const BodyContent = styled.div`
  color: white;
  text-align: center;
  font-size: larger;
  opacity: 0.9;
`;
const TabCustom = styled(Tabs)`
  min-height: 35vh;

  .ant-tabs-nav {
    margin-bottom: 0px !important;
  }

  .ant-tabs-nav-list {
    width: 100%;
  }

  .ant-tabs-tab {
    justify-content: center;
    width: 33.33% !important;
    padding: 5px !important;
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
`;
//#endregion

export default function InputEmailAddress() {
  const [showQuestion, setShowQuestion] = useState(false);
  const [enableNext, setEnableNext] = useState(false);
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const [employeeEmail2, setEmployeeEmail2] = useState([]);
  const [employeeEmail3, setEmployeeEmail3] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [totalEmployee2, setTotalEmployee2] = useState(0);
  const [totalEmployee3, setTotalEmployee3] = useState(0);
  const navigate = useNavigate();
  const splitEmail = /[a-z0-9]+(\.{1}[a-z0-9]+)*@[a-z]+(\.[a-z]*)+/gmi;
  const regexEmail = /^[a-z0-9]+(\.{1}[a-z0-9]+)*@[a-z]+(\.[a-z]*)+$/i;

  const conditionCheckEmail = (text) => {
    return regexEmail.test(text);
  }

  const pasteFromClipboard = async (rank) => {
    var text = await navigator.clipboard.readText();
    if(text?.length <= 0) return;
    var emails = text.match(splitEmail);
    switch (rank) {
      case 1:
        setEmployeeEmails(emails);
        break;
      case 2:
        setEmployeeEmail2(emails);
        break;
      case 3:
        setEmployeeEmail3(emails);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    
  },[]);

  useEffect(() => {
    setTotalEmployee(employeeEmails?.length || 0);
  },[employeeEmails]);

  useEffect(() => {
    setTotalEmployee2(employeeEmail2?.length || 0);
  },[employeeEmail2]);

  useEffect(() => {
    setTotalEmployee3(employeeEmail3?.length || 0);
  },[employeeEmail3]);

  useEffect(() => {
    if(totalEmployee > 0 && totalEmployee2 > 0 && totalEmployee3 > 0) setEnableNext(true);
    else setEnableNext(false);
  },[totalEmployee, totalEmployee2, totalEmployee3]);

  return (
      <BodyContent>
        <Image preview={false} width={50} style={{ marginTop: '1vh' }} src={chatImage} onClick={() => setShowQuestion(true)} />
        <Row style={{ justifyContent: 'center', margin: '1vh 5vw 0vh 5vw', lineHeight: 'normal' }} >Here is the summary of your employees list</Row>
        {/* <Row style={{ justifyContent: 'center', margin: '1vh 10vw 3vh 10vw' }} ><div style={{ fontSize: '60%' }}>This is to generate the accurate pricing for your company.</div></Row> */}

        <Row style={{ margin: '0vh 5vw 0vh 5vw' }}>
          <Col style={{ width: '100%' }}>
            <TabCustom centered size='small' defaultActiveKey="1" type='card'>
              <Tabs.TabPane tab="Employee Rank #1" key="1" style={{ maxHeight: '40vh', overflowX: 'auto' }}>
                <DynamicAddTag tags={employeeEmails} setTags={setEmployeeEmails} maxLength={30} condition={conditionCheckEmail}></DynamicAddTag>
                <RowCenter 
                  onClick={() => pasteFromClipboard(1)} 
                  style={{ marginTop: '10vh', fontSize: 'x-large', color: '#ec5a54', cursor: 'pointer', display: (totalEmployee > 0 ? 'none' : 'block') }}
                ><CopyFilled />
                </RowCenter>
                <RowCenter
                  onClick={() => pasteFromClipboard(1)} 
                  style={{ cursor: 'pointer', userSelect: 'none', display: (totalEmployee > 0 ? 'none' : 'block') }}
                >paste from clipboard
                </RowCenter>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Employee Rank #2" key="2">
                <DynamicAddTag tags={employeeEmail2} setTags={setEmployeeEmail2} maxLength={30} condition={conditionCheckEmail}></DynamicAddTag>
                <RowCenter 
                  onClick={() => pasteFromClipboard(2)} 
                  style={{ marginTop: '10vh', fontSize: 'x-large', color: '#ec5a54', cursor: 'pointer', display: (totalEmployee2 > 0 ? 'none' : 'block') }}
                ><CopyFilled />
                </RowCenter>
                <RowCenter
                  onClick={() => pasteFromClipboard(2)} 
                  style={{ cursor: 'pointer', userSelect: 'none', display: (totalEmployee2 > 0 ? 'none' : 'block') }}
                >paste from clipboard
                </RowCenter>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Employee Rank #3" key="3">
                <DynamicAddTag tags={employeeEmail3} setTags={setEmployeeEmail3} maxLength={30} condition={conditionCheckEmail}></DynamicAddTag>
                <RowCenter 
                  onClick={() => pasteFromClipboard(3)} 
                  style={{ marginTop: '10vh', fontSize: 'x-large', color: '#ec5a54', cursor: 'pointer', display: (totalEmployee3 > 0 ? 'none' : 'block') }}
                ><CopyFilled />
                </RowCenter>
                <RowCenter
                  onClick={() => pasteFromClipboard(3)} 
                  style={{ cursor: 'pointer', userSelect: 'none', display: (totalEmployee3 > 0 ? 'none' : 'block') }}
                >paste from clipboard
                </RowCenter>
              </Tabs.TabPane>
            </TabCustom>
          </Col>
        </Row>

        <Row style={{ margin: '10px 5vw 0vh 5vw', fontSize: '70%' }}>Total Employee: {totalEmployee + totalEmployee2 + totalEmployee3}pax</Row>
        
        <Row style={{ margin: '3vh 0vw 4vh 0vw', justifyContent: 'center' }}>
          <Col span={12}><Button style={{ 
              backgroundColor: (enableNext ? '#ec5a54' : '#c6c6c6'), 
              cursor: (enableNext ? 'pointer' : 'default'),
              color: 'white', 
              width: '100%', 
              minHeight: '40px', height: 'auto', borderRadius: '5px', border: '0px', whiteSpace: 'normal' 
            }}
            type="primary"
            onClick={ () => (enableNext ? navigate(PAGE_LINK.PURCHASE_SUMMARY.NAME) : null) }
          >Next</Button></Col>
        </Row>

      <SubmitQuestionModal show={showQuestion} setShow={setShowQuestion}></SubmitQuestionModal>

      </BodyContent>
  )
}
