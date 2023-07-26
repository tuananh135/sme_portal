import { Button, Image, Upload } from "antd";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { FILE_TYPE } from "common/constants/constants";
import {
  getDataAndExtensionFromBase64,
  toBase64,
  validateFileTypeAndSize,
} from "common/utils/fileUtils";
import { ReactComponent as DoneIcon } from "assets/images/kyc-btn-done.svg";
import { ReactComponent as CaptureIcon } from "assets/images/kyc-shutter-ready.svg";
import { ReactComponent as FileUploadIcon } from "assets/images/kyc-file-upload.svg";
import { ReactComponent as ImageUploadIcon } from "assets/images/kyc-image-upload.svg";
import { ReactComponent as FrameIconFront } from "assets/images/kyc-frame-front.svg";
import { ReactComponent as FrameIconBack } from "assets/images/kyc-frame-back.svg";
import { NotificationDispatchContext } from "contexts/NotificationContext";

const StyledWebcam = styled(Webcam)`
  width: 100%;
  max-width: 600px;
`;

const UploadImageButton = styled(ImageUploadIcon)`
  top: -27.5px;
  position: relative;
  input[type="file"] {
    display: none;
  }
`;

const UploadFileButton = styled(FileUploadIcon)`
  top: -27.5px;
  position: relative;
  input[type="file"] {
    display: none;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: space-evenly;
`;

function ImageIdentityVerify({
  onClose,
  saveCaptureData,
  currentStep,
  isDisplay,
  empId,
}) {
  const { updateNotification } = useContext(NotificationDispatchContext);
  const [image, setImage] = useState(null);
  const [imageHeight, setImageHeight] = useState(0);
  const captureFrame = useRef(null);
  const videoRef = useRef(null);

  const closeModal = () => {
    setImage(null);
    onClose();
  };

  const saveData = (image) => {
    setImage(null);
    const dataFromBase64 = getDataAndExtensionFromBase64(image);
    saveCaptureData({
      fileName:
        currentStep === 0
          ? `Front.${dataFromBase64.FileExt}`
          : `Back.${dataFromBase64.FileExt}`,
      base64: dataFromBase64.FileData,
      length: 0,
      type: currentStep === 0 ? "Front" : "Back",
      employeeGroupId: empId,
    });
  };

  const videoConstraints = {
    facingMode: "user",
  };

  const captureImage = (imageSrc) => {
    setImage(imageSrc);
  };

  const beforeUpload = (file) => {
    const validateResult = validateFileTypeAndSize(file, FILE_TYPE.IMAGE, 20);
    if (validateResult.error) {
      updateNotification([
        {
          id: Math.random(),
          message: validateResult?.message,
          types: "error",
        },
      ]);
    }
    return validateResult.error ? Upload.LIST_IGNORE : false;
  };

  const getUploadProps = (type) => {
    return {
      name: `file_image`,
      onChange: async (info) => {
        const base64File = await toBase64(info.file);
        setImage(base64File);
      },
      beforeUpload: beforeUpload,
      multiple: false,
      showUploadList: false,
      accept: type === "image" ? "image/*" : "*",
    };
  };

  useEffect(() => {
    return () => {
      setImage(null);
    };
  }, []);

  const renderButtons = (getScreenshot) => (
    <>
      {currentStep === 0
        ? getScreenshot && (
            <FrameIconFront
              id="frame"
              style={{
                position: "absolute",
                width: "80%",
                maxWidth: "480px",
                height: "auto",
                top: `${
                  (imageHeight - captureFrame.current?.height?.baseVal?.value) /
                  2
                }`,
              }}
              ref={captureFrame}
            />
          )
        : getScreenshot && (
            <FrameIconBack
              id="frame"
              style={{
                position: "absolute",
                width: "80%",
                maxWidth: "480px",
                height: "auto",
                top: `${
                  (imageHeight - captureFrame.current?.height?.baseVal?.value) /
                  2
                }`,
              }}
              ref={captureFrame}
            />
          )}

      <ButtonWrapper>
        <Upload {...getUploadProps("image")}>
          <UploadImageButton width={55} height={55} />
        </Upload>

        {image ? (
          <DoneIcon
            className="cursor-pointer"
            width={80}
            height={80}
            style={{ top: "-40px", position: "relative" }}
            onClick={() => saveData(image)}
          />
        ) : (
          <CaptureIcon
            width={80}
            height={80}
            style={{ top: "-40px", position: "relative" }}
            onClick={() => {
              getScreenshot && captureImage(getScreenshot());
            }}
          />
        )}

        <Upload {...getUploadProps("file")}>
          <UploadFileButton width={55} height={55} />
        </Upload>
      </ButtonWrapper>
    </>
  );

  return (
    <div
      style={{ height: "100vh" }}
      className="background-main text-white w-100"
    >
      <div
        className="text-white text-x-large text-right px-5 py-3 background-main font-bold cursor-pointer"
        onClick={() => closeModal()}
      >
        CLOSE
      </div>
      <div className="d-flex-c center-items">
        {image ? (
          <div>
            <Image
              style={{ maxHeight: "450px", maxWidth: "600px" }}
              src={image}
              preview={false}
            />
            {renderButtons()}
          </div>
        ) : (
          <>
            {isDisplay && (
              <StyledWebcam
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onLoadedMetadata={(e) => {
                  setImageHeight(e.target.videoHeight);
                }}
                ref={videoRef}
              >
                {({ getScreenshot }) => renderButtons(getScreenshot)}
              </StyledWebcam>
            )}
          </>
        )}
      </div>
      <div className="text-white text-xx-large font-bold text-center">
        {image
          ? `Photo is taken. Please click tick button again to save.`
          : `Place the ${
              currentStep === 0 ? "front" : "back"
            } of your NRIC inside the frame`}
      </div>
    </div>
  );
}

export default ImageIdentityVerify;
