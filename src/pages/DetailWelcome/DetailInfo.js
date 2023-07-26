import { Button, Image, Input } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { ArrowRightOutlined } from "@ant-design/icons";

import bg_mobile from "assets/images/landing-banner-mobile.jpg";
import bg_web from "assets/images/landing-banner-web.jpg";
import logo from "assets/images/logo.png";
import { ReactComponent as VideoIcon } from "assets/images/icon-video.svg";
import SME_EZY from "./SME_EZY_Detail";
import PrimaryButton from "common/components/Button/PrimaryButton";
import { useNavigate } from "react-router-dom";
import SME_EZY_Detail from "./SME_EZY_Detail";
import { PAGE_LINK } from "common/constants/pagelinks";
import Active8InfoModal from "../Welcome/component/Active8InfoModal";

const Main = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 200%;
    bottom: 0;
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const ImageBackground = styled(Image)`
  width: 100%;
  position: relative;
`;

const Background = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const MainWelcome = styled.div`
  position: absolute;
  top: 15%;
  width: 100%;
  text-align: center;
  color: #fff;
  z-index: 2;
  font-size: 1.3rem;
`;

const Header = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-33px);
`;

const StartSubmitButton = styled(Button)`
  height: auto;
  padding: 10px !important;
  border-top-right-radius: 24px !important;
  border-bottom-right-radius: 24px !important;
  color: white;
  background-color: lightgrey;
`;

export default function DetailInfo({ isMobile }) {
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);

  const next = () => {
    navigate(PAGE_LINK.BUDGET_PER_EMP.NAME);
  };
  return (
    <Background>
      <Main>
        <ImageBackground
          src={isMobile ? bg_mobile : bg_web}
          alt="bg"
          preview={false}
        />

        <Header>
          <Image src={logo} alt="logo" preview={false} style={{ width: 66 }} />
        </Header>
        <MainWelcome onClick={() => setShowDetail(true)}>
          "Take care of your people
          <br />
          and they will take care of
          <br />
          your business"
          <div className="mt-3 text-small text-light mb-5">- J.W Marriot -</div>
          <Input.Group compact>
            <Input
              className="start-text"
              style={{
                width: "calc(100% - 200px)",
                maxWidth: "300px",
              }}
            />
            <StartSubmitButton onClick={next}>
              Start
              <ArrowRightOutlined />
            </StartSubmitButton>
          </Input.Group>
          <VideoIcon className="mt-5" style={{ height: 20 }} />
          <div className="text-center text-small">
            What is <b>SME EZY</b>?<br />
            Watch video
          </div>
        </MainWelcome>
      </Main>
      <SME_EZY_Detail />
      <div>
        <div>Documents</div>
      </div>
      <PrimaryButton
        style={{
          position: "fixed",
          bottom: 0,
          maxWidth: "300px",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
        text={"START"}
        onClick={next}
      />
    </Background>
  );
}
