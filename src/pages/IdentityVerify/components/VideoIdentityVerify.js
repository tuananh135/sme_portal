import React, { useContext, useRef, useState } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { Image, Upload } from "antd";
import { FILE_TYPE } from "common/constants/constants";
import {
  getDataAndExtensionFromBase64,
  toBase64,
  validateFileTypeAndSize,
} from "common/utils/fileUtils";
import { ReactComponent as DoneIcon } from "assets/images/kyc-btn-done.svg";
import { ReactComponent as CaptureIcon } from "assets/images/kyc-shutter-ready.svg";
import { ReactComponent as CapturingIcon } from "assets/images/kyc-shutter-record.svg";
import { ReactComponent as FileUploadIcon } from "assets/images/kyc-file-upload.svg";
import { ReactComponent as ImageUploadIcon } from "assets/images/kyc-image-upload.svg";
import { ReactComponent as FrameIconVideo } from "assets/images/kyc-frame-video.svg";
import { blobToBase64 } from "common/utils/objectUtils";
import { NotificationDispatchContext } from "contexts/NotificationContext";
import _ from "lodash"

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

const VideoIdentityVerify = ({ onClose, saveCaptureData, empId }) => {
  const { updateNotification } = useContext(NotificationDispatchContext);
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [video, setVideo] = useState(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const captureFrame = useRef(null);

  const closeModal = () => {
    setVideo(null);
    onClose();
  };

  const saveData = (data) => {
    setVideo(null);
    const dataFromBase64 = getDataAndExtensionFromBase64(data);
    saveCaptureData({
      FileName: `Video.${dataFromBase64.FileExt}`,
      Base64: dataFromBase64.FileData,
      Length: 0,
      type: "Video",
      EmployeeGroupId: empId,
    });
  };

  const handleStartCaptureClick = () => {
    const type = ["video/webm", "video/mp4"];

    const selectedType = _.find(type, e => MediaRecorder.isTypeSupported(e));

    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: selectedType,
    });
    mediaRecorderRef.current.start();
    mediaRecorderRef.current.ondataavailable = async (event) => {
      if (!event.data) return;
      if (event.data.size === 0) return;
      const blob = new Blob([event.data], { type: selectedType });
      const base64 = await blobToBase64(blob);
      setVideo(base64);
    }  
  }

  const handleStopCaptureClick = () => {
    setCapturing(false);
    mediaRecorderRef.current.stop();
  }

  const beforeUpload = (file) => {
    const validateResult = validateFileTypeAndSize(file, [], 100);
    if (validateResult.error) {
      updateNotification([
        {
          id: Math.random(),
          message: validateResult?.message,
          types: "error",
        },
      ]);
    }
    var testEl = document.createElement( "video" );
    if (testEl.canPlayType(file.type) == "") {
      updateNotification([
        {
          id: Math.random(),
          message: "Sorry, uploaded file format is invalid",
          types: "error",
        },
      ]);
      return Upload.LIST_IGNORE;
    }
    return validateResult.error ? Upload.LIST_IGNORE : false;
  };

  const getUploadProps = (type) => {
    return {
      name: `file_video`,
      onChange: async (info) => {
        const base64File = await toBase64(info.file);
        setVideo(base64File);
      },
      beforeUpload: beforeUpload,
      multiple: false,
      showUploadList: false,
      accept: type === "video" ? "video/*" : "*",
    };
  };
  const renderButtons = () => (
    <>
      <FrameIconVideo
        style={{
          position: "absolute",
          width: "70%",
          maxWidth: "480px",
          height: "auto",
          top: `${(imageHeight - captureFrame.current?.height?.baseVal?.value) / 2 +
            50
            }`,
        }}
        ref={captureFrame}
      />

      <ButtonWrapper>
        <Upload {...getUploadProps("video")}>
          <UploadImageButton width={55} height={55} />
        </Upload>

        {!!video ? (
          <DoneIcon
            className="cursor-pointer"
            width={80}
            height={80}
            style={{ top: "-40px", position: "relative" }}
            onClick={() => saveData(video)}
          />
        ) : (capturing ? (
          <CaptureIcon
            width={80}
            height={80}
            style={{ top: "-40px", position: "relative" }}
            onClick={handleStopCaptureClick}
          />
        ) : (
          <CapturingIcon
            width={80}
            height={80}
            style={{ top: "-40px", position: "relative" }}
            onClick={handleStartCaptureClick}
          />
        ))}

        <Upload {...getUploadProps("file")}>
          <UploadFileButton width={55} height={55} />
        </Upload>
      </ButtonWrapper>
    </>
  );
  return (
    <>
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
          <StyledWebcam
            audio={false}
            ref={webcamRef}
            onLoadedMetadata={(e) => {
              setImageHeight(e.target.videoHeight);
            }}
          />
          {renderButtons()}
        </div>
        <div className="text-white text-xx-large font-bold text-center">
          {capturing
            ? "Capturing… smile a little and click to finish recording"
            : video
              ? "Please click again to save the video"
              : "Please position yourself with your NRIC within the frame. Once ready please click to record"}
        </div>
      </div>
    </>
  );
};
export default VideoIdentityVerify;
// https://www.npmjs.com/package/react-webcam
