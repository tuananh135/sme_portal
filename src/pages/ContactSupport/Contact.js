import { AuthContext } from 'contexts/AuthContext'
import { Button, Col, Image, Input, Row } from 'antd'
import styled from 'styled-components'
import { CloseOutlined, MessageOutlined, WhatsAppOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'

//#region Custom theme
const BodyTheme = styled.div`
  color: #FFFFFF;
  overflow: hidden;
  font-family: "GothamRounded-Book", Helvetica, Arial, sans-serif;
  margin-left: 5vw;
  margin-right: 5vw;
`
const CenterText = styled.p`
  text-align: center;
  background-color: transparent;
  border-color: transparent;
  resize: none;
`
//#endregion

export default function Contact() {
  return (
    <BodyTheme>
      <Row style={{ marginTop: '10px', placeContent: 'center' }}>
        <CloseOutlined style={{ position: 'absolute', right: '0px', paddingRight: 10 }} />
      </Row>

      <Row style={{ marginTop: '10px', placeContent: 'center' }}>
        <Image 
          style={{ width: 60, height: 60, objectFit: 'contain' }} 
          preview={false} 
          src='https://freepngimg.com/thumb/girl/139538-mobile-using-smiling-girl-phone.png'/>
      </Row>

      <Row style={{ textAlign: 'center', placeContent: 'center' }}>
        <CenterText>We may need you to answer few health declaration questions for all your employees. Please contact our team for further support</CenterText>
      </Row>

      <Row style={{ marginTop: '5px' }}>
        <Col span={12}>
          <Button style={{ borderRadius: '5px', width: '90%', backgroundColor: '#4caf50', borderColor: 'transparent', color: '#FFFFFF' }} icon={<WhatsAppOutlined />} size={'large'}>
            WhatsApp
          </Button>
        </Col>
        <Col span={12}>
          <Button style={{ borderRadius: '5px', width: '90%', backgroundColor: '#3074f2', borderColor: 'transparent', color: '#FFFFFF' }} icon={<MessageOutlined />} size={'large'}>
            Messenger
          </Button>
        </Col>
      </Row>

      <Row style={{ marginTop: '10px', textAlign: 'center', placeContent: 'center' }}>
        <CenterText>Alternatively, you can leave your enquiry and. we will reach you later.</CenterText>
      </Row>
      <Row style={{ marginTop: '5px' }}>
        <Input aria-disabled={true} placeholder="Contact Number" autoSize />
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Input aria-disabled={true} placeholder="Email" autoSize />
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <TextArea
          maxLength={1000}
          style={{ height: 100, resize: 'none' }}
          placeholder="Enquiry"
        />
      </Row>
      <Row style={{ marginTop: '15px', justifyContent: 'center' }}>
        <Col span={15}>
          <Button style={{ borderRadius: '5px', width: '90%', backgroundColor: '#ec5a54', borderColor: 'transparent', color: '#FFFFFF' }} size={'large'}>
            SEND
          </Button>
        </Col>
      </Row>
    </BodyTheme>
  )
}
