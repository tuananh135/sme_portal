import { Image, Row } from 'antd'
import styled from 'styled-components'
import chatImage from 'assets/images/nina-small.png'
import { useState } from 'react'
import SubmitQuestionModal from 'common/components/Modal/SubmitQuestionModal'
import { ArrowLeftOutlined } from '@ant-design/icons'

//#region Custom theme
const BodyTheme = styled.div`
  color: #FFFFFF;
  text-align: center;
  font-family: "GothamRounded-Book", Helvetica, Arial, sans-serif;
`
//#endregion

export default function ApologizeNotEligible() {
  const [showQuestion, setShowQuestion] = useState(false);

  const backToPrevious = () => {
    console.log('click back');
  }

  return (
    <BodyTheme style={{ alignItems: 'center' }}>
      <Image preview={false} width={50} style={{ marginTop: '2vh' }} src={chatImage} onClick={() => setShowQuestion(true)} />
      <Row style={{ justifyContent: 'center', margin: '2vh 5vw 0vh 5vw', fontSize: 'large' }} >We Apologize,</Row>
      <Row style={{ justifyContent: 'center', margin: '2vh 5vw 0vh 5vw', fontSize: 'large' }} >
        You are not eligible with the plan
        Please refer to your human resource
        Department for further information.</Row>
      
      <Row style={{ justifyContent: 'center', margin: '4vh 5vw 0vh 5vw', fontSize: 'large', cursor: 'pointer' }} onClick={backToPrevious}><ArrowLeftOutlined style={{ padding: 5 }} />Back</Row>

      <SubmitQuestionModal show={showQuestion} setShow={setShowQuestion}></SubmitQuestionModal>

    </BodyTheme>
  )
}
