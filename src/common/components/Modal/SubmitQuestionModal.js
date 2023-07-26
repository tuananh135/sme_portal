import { Button, Col, Image, Input, Modal, Row } from "antd";
import { useState, useEffect, useRef } from "react";
import whatsappImage from 'assets/images/whatsapp.svg'
import messengerImage from 'assets/images/messenger.svg'
import styled from 'styled-components'
import TextArea from "antd/lib/input/TextArea";
import ReactPlayer from "react-player";
import SuccessSubmitQuestionModal from "../Modal/SuccessSubmitQuestionModal";
import { useNavigate, useLocation } from "react-router-dom";
import { padEnd } from "lodash";
import { PAGE_LINK } from "common/constants/pagelinks";

//#region Custom theme
const ModalCustom = styled(Modal)`
  margin: 0!important;
  .ant-modal, .ant-modal-content {
    text-align: -webkit-center;
    height: 120vh;
    width: 100vw;
    top: 0;
    position:fixed;
    background: rgba(0,0,0,0.6);
  }
`;

//#endregion

function SubmitQuestionModal({ show, setShow,pageName }) {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const navigate = useNavigate();
  const [play, setPlay] = useState(null);

  const handleClosePreviousPage = () => {
    // close the previous page using the navigate function from react-router-dom
    navigate(0);
  };

  const playerRef = useRef(null);

  const stopVideo = () => {
    if (playerRef.current) {
      setShow(false)
      playerRef.current.getInternalPlayer().pauseVideo();
    }
    
  };

  let header = null;

  const getTimecodeBasedOnPage = () => {
    if (pageName === 'Introduction') {
      header = 'Part 1: Introduction';
      return 'https://youtu.be/t71qE_wUJ80?t=0';
    }  else if (pageName === 'NoOfEmployee') {
      header = 'What is Activ8 & 3 years premium guarantee?';
      return 'https://youtu.be/t71qE_wUJ80?t=100';
    }  else if (pageName === 'budgetInput') {
      header = 'Part 2: How to get quote in 3 minutes?';
      return 'https://youtu.be/t71qE_wUJ80?t=160';
    } else if (pageName === 'budgetOffer') {
      header = 'Part 3: What is plan recommendation?';
      return 'https://youtu.be/t71qE_wUJ80?t=243';
    } else if (pageName === 'budgetOfferCustomise') {
      header = 'Part 4: How to customise the plan?';
      return 'https://youtu.be/t71qE_wUJ80?t=264';
    } else if (pageName === 'businessDetails') {
      header = 'Part 5: How to fill in business details?';
      return 'https://youtu.be/t71qE_wUJ80?t=339';
    } else if (pageName === 'PersonInCharge') {
      header = 'Who is Person in-charge';
      return 'https://youtu.be/t71qE_wUJ80?t=374';
    } else if (pageName === 'eKYC') {
      header = 'Part 6: What is eKYC?';
      return 'https://youtu.be/t71qE_wUJ80?t=395';
    }  if (pageName === 'EmployeeProvider') {
      header = 'Part 7: What is employee data?';
      return 'https://youtu.be/t71qE_wUJ80?t=437';
    } else if (pageName === 'uploadFile') {
      header = 'Part 8: Employee data upload';
      return 'https://youtu.be/t71qE_wUJ80?t=463';
    } else if (pageName === 'SelfCompleteEmp') {
      header = 'Part 9: Employee self fill in';
      return 'https://youtu.be/t71qE_wUJ80?t=496';
    } else if (pageName === 'UnderwritingQuestion') {
      header = 'Part 10: What is underwriting question?';
      return 'https://youtu.be/t71qE_wUJ80?t=550';
    } else if (pageName === 'DirectorDetails') {
      header = 'Part 11: What is directors details?';
      return 'https://youtu.be/t71qE_wUJ80?t=593';
    } else if (pageName === 'PEP') {
      header = 'Part 12: What is PEP?';
      return 'https://youtu.be/t71qE_wUJ80?t=632';
    } else if (pageName === 'PaymentType') {
      header = 'Part 13: How to make payment?';
      return 'https://youtu.be/t71qE_wUJ80?t=678';
    } else if (pageName === 'ErrorMessage') {
      header = 'What is error 1099?';
      return 'https://youtu.be/t71qE_wUJ80?t=574';
    } else if (pageName === 'BusinessDoc') {
      header = 'What is business document?';
      return 'https://youtu.be/t71qE_wUJ80?t=659';
    } 
    else if (pageName === 'Successful') {
      header = 'Successful';
      return 'https://youtu.be/t71qE_wUJ80?t=728';
    } 
  };

  const url = getTimecodeBasedOnPage();

  useEffect(() => {
    !play && setShow(false);
    return setPlay(true);
  }, [play])

  return (
    <ModalCustom
      open={show}
      onCancel={stopVideo}
      className="text-white  d-flex submit-question"
      footer={null}
    >
      <Row style={{ margin: '3vh 2vw', fontWeight: 'bold',fontSize: '18px'}}>{header}</Row>
     <ReactPlayer
        url={url}
        playing={play}
        ref={playerRef}
        controls={true}
        Width="100%"
        height="100%"
        className="react-player"
      />
        <Row style={{ textAlign: 'center', whiteSpace: 'break-spaces', margin: '3vh 2vw', fontWeight: 'bold' }} className="max-width-input">
        <Col span={24}>
        Still not sure? <br></br>
        Kindly contact our team for further support
        </Col>
      </Row>
        <Row style={{ justifyContent: 'center' }} className="max-width-input">
      <Col span={24} ><a href="https://wa.me/601153901568?text=hello" target="_blank" rel="noopener noreferrer"><Image preview={false} type="primary" src={whatsappImage}  style={{ height: '5%', padding: 8}}/></a></Col>    
      </Row>
      <Row style={{ textAlign: 'center', whiteSpace: 'break-spaces', margin: '3vh 2vw', fontWeight: 'bold' }} className="max-width-input">
        <Col span={24}>
        Alternatively, you can leave your inquiry and we will reach you later
        </Col>
      </Row>
      <Row style={{ justifyContent: 'center' }} className="max-width-input">
        <Col span={24} ><Input style={{ marginBottom: 10 }} placeholder='Contact Number' /></Col>
        <Col span={24} ><Input style={{ marginBottom: 10 }} placeholder='Email' /></Col>
        <Col span={24} ><TextArea style={{ marginBottom: 10 }} placeholder='Enquiry' /></Col>
      </Row>
      <Button style={{ 
          backgroundColor: '#ec5a54', color: 'white', minWidth: '200px', 
          minHeight: '45px', height: 'auto', borderRadius: '5px', border: '0px', whiteSpace: 'normal' 
        }}
        type="primary" onClick={()=>setShowQuestionModal(true)}
        className="half-width-button"
      >Send</Button>
      {<SuccessSubmitQuestionModal show={showQuestionModal} setModalShow={setShowQuestionModal} onClosePreviousPage={handleClosePreviousPage}/>}
    </ModalCustom>
  );
}

export default SubmitQuestionModal;
