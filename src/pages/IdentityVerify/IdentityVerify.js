import { Modal, Timeline, notification } from "antd";
import PrimaryButton from "common/components/Button/PrimaryButton";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ImageIdentityVerify from "./components/ImageIdentityVerify";
import StepComponent from "./components/StepComponent";
import VideoIdentityVerify from "./components/VideoIdentityVerify";
import { ReactComponent as EkycIcon } from "assets/images/kyc-illustration.svg";
import { ReactComponent as EkycIconFront } from "assets/images/kyc-icon-front.svg";
import { ReactComponent as EkycIconBack } from "assets/images/kyc-icon-back.svg";
import { ReactComponent as EkycIconVideo } from "assets/images/kyc-icon-video.svg";
import { useNavigate } from "react-router-dom";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { PAGE_LINK } from "common/constants/pagelinks";
import { KYCService } from "services/B2CService/KYCService";
import { DocumentService } from "services/B2CService/DocumentService";
import { EmpGroupStateContext } from "contexts/EmpGroupContext";
import { CommonStateContext } from "contexts/CommonStateContext";
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";
import { AUTHORISATION_STATUS, KYC_AUTO_REDIRECT_SUCCESS_PAGE, KYC_STATUS } from "common/constants/constants";
import { useSearchParams } from "react-router-dom";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";

const StyledStepComponent = styled(StepComponent)`
  background: white;
  margin-bottom: 36px;
  padding: 12px;
`;

function IdentityVerify() {
  const [documents, setDocuments] = useState({
    front: null,
    back: null,
    video: null,
  });
  const [docStatus, setDocStatus] = useState({
    front: false,
    back: false,
    video: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const navigate = useNavigate();
  const { empGroupID, empGroupData } = React.useContext(EmpGroupStateContext);
  const { isLoading } = React.useContext(CommonStateContext);
  const [ searchParams ] = useSearchParams();
  const [shouldReupload, setShouldReupload] = useState(false);

  const steps = [
    {
      desc: (
        <div>
          Take a <b>FRONT</b> photo of your NRIC
        </div>
      ),
      type: "front",
      icon: <EkycIconFront width={50} height={65} />,
      action: (index) => ShowModal(index),
    },
    {
      desc: (
        <div>
          Take a <b>BACK</b> photo of your NRIC
        </div>
      ),
      type: "back",
      icon: <EkycIconBack width={50} height={65} />,
      action: (index) => ShowModal(index),
    },
    {
      desc: (
        <div>
          Take a <b>VIDEO</b> with your NRIC
        </div>
      ),
      type: "video",
      icon: <EkycIconVideo width={50} height={65} />,
      action: (index) => ShowModal(index),
    },
  ];

  const getCurrentIdentityData = async (id) => {
    let currDocStatus = {
      front: false,
      back: false,
      video: false
    }
    const rs = await EmployeeGroupService.GetDocByGroupID(id);
    if (rs.status === 200 && rs.data?.length > 0) {
      rs.data.forEach(element => {
        if (element.data) {
          currDocStatus[element.type.toLowerCase()] = true;
        }
      });
      setDocStatus(currDocStatus)
    }
    return rs?.data;
  }
  useEffect(() => {
    Promise.all([getCurrentIdentityData(empGroupID),searchStatusKYCReupload(empGroupID)])    
  }, [])


  const ShowModal = (index) => {
    if (empGroupData?.authorisationStatus === AUTHORISATION_STATUS.APPROVED) {
      notification.error({
        message: 'You cannot update the information once the director has approved.',
      });
      return;
    }
    setCurrentStep(index);
    if (index === 0 || index === 1) {
      setShowImageModal(true);
    } else {
      setShowVideoModal(true);
    }
  };

  const searchStatusKYCReupload = async (id) => {
    // if equal false => do not redirect to success page
    const directly = searchParams.get("directly");
    if (directly === KYC_AUTO_REDIRECT_SUCCESS_PAGE.NO_REDIRECT) {
      setShouldReupload(false);
      return;
    }

    var result = await KYCService.SearchKYCReuploadStatus(id);
    setShouldReupload(result?.data?.data === KYC_AUTO_REDIRECT_SUCCESS_PAGE.REDIRECT);
  };

  const AutoNavigateWhenKYCReupload = async () => {
    // check click from email link
    if (shouldReupload) {
      navigate(`${PAGE_LINK.KYC_UPLOAD_SUCCESS.NAME}/${empGroupID}`);
      return true;
    }
    await KYCService.UpdateKYCReuploadStatus(empGroupID, 0);
    return false;
  };

  const closeModal = () => {
    if (currentStep === 0 || currentStep === 1) {
      setShowImageModal(false);
    } else {
      setShowVideoModal(false);
    }
  };

  const saveCaptureData = (data) => {
    setDocuments((prev) => ({ ...prev, [steps[currentStep].type]: data }));
    closeModal();
    setCurrentStep(prev => prev < steps.length ? prev + 1 : prev);
  };

  const onNext = async () => {
    // dont save if director approved
    if (empGroupData?.authorisationStatus === AUTHORISATION_STATUS.APPROVED
      && empGroupData.kycStatus === KYC_STATUS.APPROVED) {
      navigate(`${PAGE_LINK.EMPLOYEE_PROVIDER.NAME}/${empGroupID}`);
      return;
    }

    console.log(Object.values(documents));

    // fix, update KYC status to VERIFY
    await KYCService.UpdateKycStatus({ id: empGroupID, newStatus: KYC_STATUS.VERIFY });

    if (Object.values(documents).every((item) => !!item)) {
      const result = await DocumentService.PostManyDocument(Object.values(documents));
      if (result.status === 200) {
        // check click from email link
        if (await AutoNavigateWhenKYCReupload()) return;
        navigate(`${PAGE_LINK.EMPLOYEE_PROVIDER.NAME}/${empGroupID}`);
      }
    }
    if (Object.values(docStatus).every((item) => item)) {
      if (await AutoNavigateWhenKYCReupload()) return;
      navigate(`${PAGE_LINK.EMPLOYEE_PROVIDER.NAME}/${empGroupID}`);
    }
  }

  return (
    <div className="d-flex-c center-items text-white mt-5">
      <ChatIcon pageName="eKYC" width={50}/>
      <br></br>
      <EkycIcon width={150} height={100} />
      <StepProgressTrigger/>
      <div className="text-x-large font-bold mt-5">Verify your ID</div>
      <div className="text-small mb-5">Please follow these simple steps</div>
      
      {steps?.map((step, index) => (
        <StyledStepComponent
          className="d-flex-r w-90 max-width-input border-round"
          data={step}
          index={index}
          isDone={!!documents[`${step.type}`] || docStatus[`${step.type}`]}
          disabled={index > currentStep}
          isLast={index === steps?.length - 1}
          key={index}
        />
      ))}
      <PrimaryButton
        rootclass="my-5 w-50 max-width-button"
        text={"Next"}
        disabled={!(Object.values(documents).every((item) => !!item) || Object.values(docStatus).every((item) => item))}
        onClick={onNext}
        isLoading={isLoading}
      />
      {/* <div className="text-underline">What it is about?</div> */}

      <Modal
        open={showImageModal}
        className="verify-identity text-white d-flex"
        footer={null}
        closable={false}
      >
        <ImageIdentityVerify
          onClose={closeModal}
          saveCaptureData={saveCaptureData}
          currentStep={currentStep}
          isDisplay={showImageModal}
          empId={empGroupID}
        />
      </Modal>

      <Modal
        open={showVideoModal}
        className="verify-identity text-white d-flex"
        footer={null}
        closable={false}
      >
        <VideoIdentityVerify
          onClose={() => setShowVideoModal(false)}
          saveCaptureData={saveCaptureData}
          empId={empGroupID}
        />
      </Modal>
    </div>
  );
}

export default IdentityVerify;
