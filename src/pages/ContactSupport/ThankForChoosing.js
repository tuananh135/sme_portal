import { Image, Row } from 'antd'
import styled from 'styled-components'
import chatImage from 'assets/images/nina-small.png'
import { useState } from 'react'
import SubmitQuestionModal from 'common/components/Modal/SubmitQuestionModal'

//#region Custom theme
const BodyTheme = styled.div`
  color: #FFFFFF;
  text-align: center;
  font-family: "GothamRounded-Book", Helvetica, Arial, sans-serif;
`
//#endregionS

export default function ThankForChoosing() {
  const [showQuestion, setShowQuestion] = useState(false);
  return (
    <BodyTheme style={{ alignItems: 'center' }}>
      <Image preview={false} width={50} style={{ marginTop: '2vh' }} src={chatImage} onClick={() => setShowQuestion(true)} />
      <Row style={{ justifyContent: 'center', margin: '2vh 5vw 0vh 5vw', fontSize: 'large' }} >Thank you</Row>
      <Row style={{ justifyContent: 'center', margin: '0vh 5vw 0vh 5vw', fontSize: 'large' }} >For choosing us</Row>

      <SubmitQuestionModal show={showQuestion} setShow={setShowQuestion}></SubmitQuestionModal>

    </BodyTheme>
  )
}
