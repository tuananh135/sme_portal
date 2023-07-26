import { Button, Col, Image, Input, Modal, Row } from 'antd'
import styled from 'styled-components'
import chatImage from 'assets/images/nina-small.png'
import { useState } from 'react'
import BackgroundImage from 'assets/images/activ8-background.jpg'
import IconImage from 'assets/images/icon-3years.svg'
import VideoIcon from "assets/images/icon-video.svg";

//#region Custom theme
const ModalBody = styled(Modal)`
  margin: 0!important;
  .ant-modal, .ant-modal-content {
    text-align: -webkit-center;
    height: 100vh;
    width: 100vw;
    top: 0;
    position:fixed;
    background: white;
  }
`;
const ModalContent = styled(Modal)`

  .ant-modal-close {
    top: -30px;
    right: -5px;
    color: white;
    background-color: black;
    border-radius: 30px;
  }

  .ant-modal-close-x {
    font-size: 20px !important;
  }

  .ant-modal-content {
    color: white;
    text-align: center;
    border-radius: 25px;
    background: linear-gradient(
      rgba(0, 0, 0, 0.4), 
      rgba(0, 0, 0, 0.7)
    ), url("${BackgroundImage}");
    background-position: 17%;
    background-repeat: no-repeat;
    background-size: cover;
  }
`;
//#endregion

export default function Activity() {

  const onClose = () => {
    console.log('close');
  }
  return (
    <ModalBody
      open={true}
      className="text-white d-flex submit-question"
      footer={null}
      closable={null}
    >
      <ModalContent
        centered
        open={true}
        bodyStyle={{ height: '80vh' }}
        onCancel={onClose}
        footer={null}
      >
        <Image src={IconImage} preview={false} style={{ margin: '2vh 0vw 2vh 0vw' }}></Image>
        <Row style={{ justifyContent: 'center', fontSize: 'initial' }}>Get into our wellness programme</Row>
        <Row style={{ justifyContent: 'center', fontSize: 'initial' }}>And get 3 Years Fixed Rates on</Row>
        <Row style={{ justifyContent: 'center', fontSize: 'initial', margin: '0vh 0vw 2vh 0vw' }}>Your annual premium!</Row>
        <Row><small>Activ8 is a health-based rewards programme designed to
motivate employees to stay healthy and be the best version of
themselves to achieve more in life. Business owners can als0
use this opportunity as an engagement programme to
encourage an active lifestyle among employees.</small></Row>
      
        <Image src={VideoIcon} preview={false} style={{ margin: '20px 0px 10px 0px' }}></Image>
        <Row style={{ justifyContent: 'center', marginBottom: 20, fontSize: 'smaller' }}>Learn more about Activ8</Row>

      </ModalContent>

    </ModalBody>
  )
}
