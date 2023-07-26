import { Image, Input, Button, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import styled from "styled-components";
import bg_mobile from "assets/images/banner-mobile.jpeg";
import bg_web from "assets/images/Banner-web.jpeg";
import logo from "assets/images/logo.png";
import download_icon from "assets/images/icon-download.svg";
import SME_EZY from "./SME_EZY";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ReactComponent as VideoIcon } from "assets/images/icon-video.svg";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import SubmitQuestionModal from "common/components/Modal/SubmitQuestionModal";
import { PAGE_LINK } from "common/constants/pagelinks";
import VideoPlayerModal from "common/components/VideoPlayer/VideoPlayer";
import documentIcon from "assets/images/icon-document.svg";
import PolicyWording from "assets/documents/PolicyWording.pdf";
import PremiumTable from "assets/documents/PremiumTable.pdf";
import ProductDisclosureSheet from "assets/documents/ProductDisclosureSheet.pdf";
import StarterKit from "assets/documents/StarterKit.pdf";
import DesktopHeader from "common/components/DesktopHeader/DesktopHeader";
import PDS_GHS_3YRT from "assets/documents/PDS-GHS3YRT-English-4plan_vLY-v2.pdf";
import PDS_GPSP from "assets/documents/PDS-GPSP-English.pdf";
import PDS_GHS_YRT from "assets/documents/PDS-GHSYRT-English-4plans_vLY-v2.pdf";
import PDS_GTL from "assets/documents/PDS-GTL-Uniform-English-JA-0304_vLY-V4.pdf";
import Policy_Contract_GHS_3YRT from "assets/documents/PolicyContract_GHS3YRT-English-JA.pdf";
import Policy_Contract_GHS_3YRT_GPSP from "assets/documents/PolicyContract_GHS3YRT-GPSP-English-JA.pdf";
import Policy_Contract_GHS_YRT from "assets/documents/PolicyContract_GHSYRT-English-JA.pdf";
import Policy_Contract_GHS_YRT_GPSP from "assets/documents/PolicyContract_GHSYRT-GPSP-English-JA.pdf";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";
import ProgressModal from "common/components/Modal/ProgressModal";
import { AuthContext, AuthDispatchContext } from "contexts/AuthContext";

const Main = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 2;
`;

const PolicyContracts = [
  { name: 'PolicyContract_GHS3YRT-English-JA.pdf', url: Policy_Contract_GHS_3YRT },
  { name: 'PolicyContract_GHS3YRT-GPSP-English-JA.pdf', url: Policy_Contract_GHS_3YRT_GPSP },
  { name: 'PolicyContract_GHSYRT-English-JA.pdf', url: Policy_Contract_GHS_YRT },
  { name: 'PolicyContract_GHSYRT-GPSP-English-JA.pdf', url: Policy_Contract_GHS_YRT_GPSP }
];

const PDS_MedicalCardActiv8 = [
  { name: 'PDS-GHS3YRT-English-4plan_vLY-v2.pdf', url: PDS_GHS_3YRT },
];

const PDS_MedicalCard = [
  { name: 'PDS-GHSYRT-English-4plans_vLY-v2.pdf', url: PDS_GHS_YRT },
];

const PDS_GPSP_ = [
  { name: 'PDS-GPSP-English.pdf', url: PDS_GPSP },
];

const PDS_GTL_ = [
  { name: 'PDS-GTL-Uniform-English-JA-0304_vLY-V4.pdf', url: PDS_GTL }
];

const MainFlur = styled.div`
  transition: height 0.3s;
  position: absolute;
  width: 100%;
  height: 200px;
  bottom: 0;
  display: block;
  background-image: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0.20), transparent);
`;

const StartSubmitButton = styled(Button)`
  height: auto !important;
  margin-top: 15px !important;
  padding: 10px !important;
  border-top-right-radius: 24px !important;
  border-bottom-right-radius: 24px !important;
  color: white !important;
`;

const ImageBackground = styled(Image)`
  width: 100%;
  position: relative;
  @media only screen and (min-width: 768px) {
    height: calc(100vh - 58px) !important;
  }
`;

const ImageBackgroundWithAutoHeight = styled(Image)`
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
  width: 100%;
  text-align: center;
  color: #fff;
  z-index: 2;
  font-size: 1.5rem;
  transition: top 1.5s;
  padding-top: 120px;
  @media only screen and (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Header = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-33px);
  @media only screen and (min-width: 768px) {
    display: none
  }
`;

const Documents = styled.div`
  width: 100%;
  text-align: center;
  background-color: #414042;
  color: #fff;
  padding: 1.5rem;
`;

const DownloadButton = styled.div`
  text-decoration: underline;
  font-size: 0.75rem;
  margin-bottom: 90px;
`;

const ErrorWrapper = styled.div`
  color: yellow;
  font-size: 10px;
  width: calc(100vh - 150px);
  max-width: 400px;
  margin: 8px auto;
  border-radius: 8px;
  padding: 2px;
`;

const StyledSelect = styled(Select)`
  width: 70%;
  min-width: 300px;
  max-width: 600px;
`;

const StyledDestopHeader = styled(DesktopHeader)`
  height: 55px;
`

const getFilePathFromName = (name) => {
  switch (name) {
    case "PolicyWording":
      return PolicyWording;
    case "PremiumTable":
      return PremiumTable;
    case "ProductDisclosureSheet":
      return ProductDisclosureSheet;
    case "StarterKit":
      return StarterKit;
    default:
      break;
  }
};


export default function Welcome({ isMobile }) {
  const [searchParams] = useSearchParams();
  const [detailMode, setDetailMode] = useState(true);
  const [isOpenVideo, setOpenVideo] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState("ProductDisclosureSheet");
  const [clicked, setClicked] = useState(false);
  const [play, setPlay] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const numberOfEmpRef = useRef({ current: 0 });
  const currentPage = "welcome";

  const { signinRedirect, getUser } = React.useContext(AuthDispatchContext);
  const { currentUser } = React.useContext(AuthContext);
  useEffect(() => {
    getUser();
  }, []);

  const navigate = useNavigate();
  const next = () => {
    if (!isInvalid && numberOfEmpRef.current >= 5) {
      localStorage.setItem("welcome.numberOfEmpRef", numberOfEmpRef.current ?? 0);
      navigate(PAGE_LINK.BUDGET_PER_EMP.NAME);
    }
  };

  const handleDownload = (selectedDocument) => {

    const files = selectedDocument === "PDS-MedicalCard(Activ8)" ? PDS_MedicalCardActiv8 :
      selectedDocument === "PDS-MedicalCard" ? PDS_MedicalCard :
        selectedDocument === "PDS-GPSP" ? PDS_GPSP_ :
          selectedDocument === "PDS-GTL" ? PDS_GTL_ :
            [];
    files.forEach((file) => {
      const link = document.createElement('a');
      link.download = file.name;
      link.href = file.url;
      link.click();
    })

  }
  const onEmployeeInput = (e) => {
    numberOfEmpRef.current = e.target.value || 0;
    if (Number.isInteger(+e.target.value) && +e.target.value >= 5 && +e.target.value <= 250) {
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  };

  const questionModal = () => {
    setShowQuestion(true)
    setOpenVideo(true)
  };

  const pdfTypes = [
    {
      value: "PDS-MedicalCard(Activ8)",
      label: "Product Disclosure Sheet - Medical Card (3 Years Premium Guarantee with Activ8)",
    },
    {
      value: "PDS-MedicalCard",
      label: "Product Disclosure Sheet - Medical Card (Yearly Premium)",
    },
    {
      value: "PDS-GPSP",
      label: "Product Disclosure Sheet - Outpatient Clinical Visit (GPSP)",
    },
    {
      value: "PDS-GTL",
      label: "Product Disclosure Sheet - Death & Disability (GTL)",
    }
  ];

  return !currentUser && !!searchParams.get("autologin") ? signinRedirect() :
    (<Background
      onMouseMove={() => setDetailMode(true)}
      style={detailMode ? { height: "auto" } : {}}
    >
      {!isMobile && <StyledDestopHeader currentPage={currentPage} />}
      <Main style={detailMode ? { position: "absolute" } : {}}>
        {
          !isMobile && detailMode ? <ImageBackgroundWithAutoHeight src={bg_web}
            alt="bg"
            preview={false} />
            : <ImageBackground
              src={isMobile ? bg_mobile : bg_web}
              alt="bg"
              preview={false}
            />
        }
        <Header>
          <Image src={logo} alt="logo" preview={false} style={{ width: 66 }} />
        </Header>

        <MainWelcome
          className="text-bold"
          style={{ top: isMobile ? (detailMode ? "9%" : "75%") : (detailMode ? "15%" : "50%") }}
        >
          {
            (!isMobile && detailMode) ?
              <span style={{ fontSize: !isMobile && detailMode && "1.75rem" }}>Hi, let us help you to get employee<br />
                insurance quote in 3 minutes</span> : <span>
                Hi, let us help you to get
                <br />
                employee insurance quote
                <br />
                in 3 minutes
              </span>
          }
          <StepProgressTrigger onClick={() => setShowProgress(true)} />

          {/* <div className="mt-3 text-small text-light">- Richard Branson -</div> */}
          {detailMode && (
            <>
              <Input.Group compact>
                <Input
                  className="start-text text-light text-small"
                  style={isMobile ? {
                    width: "calc(100% - 150px)",
                    maxWidth: "300px",
                    textAlign: "start",
                    marginTop: "15px",
                  } : {
                    width: "calc(100% - 50px)",
                    maxWidth: "450px",
                    textAlign: "start",
                    marginTop: "15px",
                  }}
                  placeholder="Enter your number of employees"
                  onChange={onEmployeeInput}
                  type="number"
                />
                <StartSubmitButton
                  className="text-small cursor-pointer"
                  style={{
                    backgroundColor: isInvalid ? "#9e9e9e" : "#ec5a54",
                  }}
                  onClick={next}
                >
                  START
                  <ArrowRightOutlined />
                </StartSubmitButton>
              </Input.Group>
              {isInvalid && (
                <ErrorWrapper className="d-flex center-items background-main">
                  <ChatIcon pageName="NoOfEmployee" width={20}></ChatIcon>
                  <div className="text-light">
                    You need to have minimum 5 employees and maximum 250 employees
                  </div>
                </ErrorWrapper>
              )}
              <VideoIcon
                preview={false}
                width={60}
                className="mt-5"
                style={{ height: 20 }}
                onClick={questionModal}
              />
              <div
                className="text-center text-small"
                onClick={questionModal}
              >
                <div className="text-light" style={{ marginTop: '-10px' }} >Watch video</div>
              </div>

            </>
          )}
        </MainWelcome>
        <MainFlur
          style={{ height: detailMode ? "calc(100% + 200px)" : "200px" }}
        />
      </Main>
      <SME_EZY detailMode={detailMode} isMobile={isMobile} />
      {detailMode && (
        <>
          <h2 style={{ display: "none" }} className="text-center text-bold text-rank-3">Ask Me Question</h2>
          <div className="text-center mb-5">
            <div>
              <ChatIcon width={60} style={{ marginBottom: "2rem", display: "none" }} />
            </div>
            <Input placeholder="Type Something" className="px-1 py-1" style={{ display: "none", maxWidth: isMobile ? 300 : 700 }} />
          </div>
          <Documents>
            <h2 className="text-center text-bold text-white mb-5">Documents</h2>
            <StyledSelect
              defaultValue="ProductDisclosureSheet"
              allowClear
              className="text-left px-1 py-1 mb-3 text-small"
              onChange={(val) => { setSelectedDoc(val) }}
            >
              {pdfTypes?.map((type, index) => (
                <Select.Option
                  value={type.value}
                  label={type.label}
                  key={index}
                >
                  <Image
                    src={documentIcon}
                    style={{ width: 20 }}
                    preview={false}
                  />
                  {type.label}
                </Select.Option>
              ))}
            </StyledSelect>
            <DownloadButton className="mt-4">
              <Image
                className="mr-2"
                style={{ width: 20 }}
                src={download_icon}
              />
              <a
                onClick={() => {
                  setClicked(true);
                  handleDownload(selectedDoc)
                }
                }
              >
                DOWNLOAD FILE
              </a>
            </DownloadButton>
          </Documents>
          <Button
            className="half-width-button"
            style={{
              backgroundColor: isInvalid ? "#9e9e9e" : "#ec5a54",
              position: "fixed",
              bottom: 20,
              width: 300,
              left: "50%",
              transform: "translate(-50%, 0)",
              zIndex: 4,
              height: 60,
              border: 'none',
              borderRadius: 10,
            }}
            type="primary"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // next();
            }}
          >
            START
          </Button>
        </>
      )}
      <SubmitQuestionModal
        pageName="Introduction"
        show={showQuestion}
        setShow={setShowQuestion}
      ></SubmitQuestionModal>
      <ProgressModal show={showProgress} setShow={setShowProgress} />
    </Background>)
}
