import { Button, Col, Image, Row } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import chatImage from 'assets/images/nina-small.png'
import PlayVideoIcon from '../../assets/images/icon-video.svg'
import SubmitQuestionModal from 'common/components/Modal/SubmitQuestionModal'
import { useNavigate, useParams } from 'react-router-dom'
import { PAGE_LINK } from 'common/constants/pagelinks'
import VideoPlayerModal from 'common/components/VideoPlayer/VideoPlayer'
import StepProgressTrigger from 'common/components/StepPanel/StepProgressTrigger';

//#region Custom theme
const BodyContent = styled.div`
  color: white;
  text-align: center;
  font-size: larger;
  opacity: 0.9;
`;
//#endregion

export default function ChooseProvideEmployee({}) {
  const [showQuestion, setShowQuestion] = useState(false);
  const {id} = useParams();
  const navigate = useNavigate();
  const [isOpenVideo, setOpenVideo] = useState(false);

  const importExcel = () => navigate(PAGE_LINK.UPLOAD_FILE.NAME+`/${id}`);
  const importClipboard = () => navigate(PAGE_LINK.SELF_COMPLETE_EMP.NAME+`/${id}`);

  return (
      <BodyContent>
        <ChatIcon pageName="EmployeeProvider" width={50} />
        {/* <Image preview={false} width={50} style={{ marginTop: '5vh' }} src={chatImage} onClick={() => setShowQuestion(true)} /> */}
        <Row style={{ justifyContent: 'center', margin: '5vh 10vw 5vh 10vw' }} >How would you want to provide your employees detail?</Row>
        <StepProgressTrigger/>
        
        <Row style={{ margin: '3vh 0vw 3vh 0vw', justifyContent: 'center' }}>
          <Button style={{ 
              backgroundColor: '#ec5a54', color: 'white', width: '80vw', 
              minHeight: '40px', height: 'auto', borderRadius: '5px', border: '0px', whiteSpace: 'normal' 
            }} 
            type="primary"
            onClick={ () => importExcel() }
          >All employee data are ready now for upload</Button>
        </Row>
        <Row style={{ margin: '3vh 0vw 4vh 0vw', justifyContent: 'center' }}>
          <Button style={{ 
              backgroundColor: '#ec5a54', color: 'white', width: '80vw', 
              minHeight: '40px', height: 'auto', borderRadius: '5px', border: '0px', whiteSpace: 'normal' 
            }}
            type="primary"
            onClick={ () => importClipboard() }
          >Employees fill in details themselves</Button>
        </Row>

        {/* <Row style={{ justifyContent: 'center', cursor: 'pointer' }} onClick={()=> setOpenVideo(true)}>
          <Col span={24}>
            <Image preview={false} src={PlayVideoIcon} width={30} />
          </Col>
          <Col span={24} className="text-small"><small>Not sure how its work?<p>Learn How</p></small></Col>
        </Row> */}

        <SubmitQuestionModal show={showQuestion} setShow={setShowQuestion}></SubmitQuestionModal>
        <VideoPlayerModal
          show={isOpenVideo}
          setShow={setOpenVideo}
          title="Providing employee data"
          description="How we process your employee data"
          footer=" We understand how important our customer data is. That's why we create a platform that simple and hr-friendly."
          url="https://www.youtube.com/watch?v=CJ0djllyqwY&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&start_radio=1&rv=3Xu-GYneWQ8&ab_channel=1theK%28%EC%9B%90%EB%8D%94%EC%BC%80%EC%9D%B4%29"
        />
      </BodyContent>
  )
}
