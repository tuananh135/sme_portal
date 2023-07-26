import { Image, Progress, Tooltip, Upload } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import upload from "assets/images/icon-camera.svg";
import documentIcon from "assets/images/icon-document.svg";
import { CheckCircleFilled, DeleteTwoTone, InfoCircleFilled } from "@ant-design/icons";
import { AUTHORISATION_STATUS, KYC_STATUS } from "common/constants/constants";

const GroupHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
`;

const ProgressCustom = styled(Progress)`
  .ant-progress-bg {
    height: 15px !important;
  }
`;

const getDesByType = (type) => {
  switch (type) {
    case "ssm":
      return "Certification of Incorporation or Full set of SSM with corporate information, summary of capital, director/shareholders information";
    case "form9":
      return "Upload Form 9 / Section 17";
    case "form24":
      return "Form 24 / Section 58 (if full set of SSM is not available)";
    case "form49":
      return "Form 49 / Section 14 (if full set of SSM is not available)";
    case "form13":
      return "Form 13 Certification of Incorporation on change of name of company (if there is change of company's name)";
    case "letter":
      return "Upload letter of authorisation";
    case "visa":
      return "Upload Current VISA Copy";
    case "visaCopy":
      return "Upload Another Visa Copy - Dependents (Optional)";
    case "passport":
      return "Upload Passport Copy";
    default:
      break;
  }
};

const UploadDocumentComponent = React.forwardRef(
  ({ componentProps, uploadData, remove, customAction, 
    statusKYC, authorisationStatus, hideIcon = false, hideProcessBar = true, changeAfterApproved, setChangeAfterApproved }, ref) => {
    const [data, setData] = useState(uploadData);
    useEffect(() => {
      setData(uploadData);
    }, [uploadData]);

    const onRemove = (e) => {
      setChangeAfterApproved(true);
      setData((prev) => ({
        ...prev,
        base64: "",
        fileExtension: "",
        fileName: "",
      }));
      remove(e);
    };

    const DrawIcon = () => {
      if (hideIcon) return null;
      if (statusKYC === KYC_STATUS.APPROVED && (data?.base64 || data?.url) && !changeAfterApproved){
        return <CheckCircleFilled style={{ fontSize: 24, color: '#00BA32', zIndex: 1, position: 'absolute', top: -10, left: -10 }} />
      }
      if ((statusKYC === KYC_STATUS.VERIFY || changeAfterApproved) && (data?.base64 || data?.url)){
        return <Tooltip placement="topLeft" title={'The director needs to approve this document'}>
                <InfoCircleFilled style={{ fontSize: 24, color: '#f49d00', zIndex: 1, position: 'absolute', top: -10, left: -10 }} />
              </Tooltip>
      }
      return null;
    };

    const DrawProcessBar = () => {
      let strokeColor, percent, messageTooltip;
      if (authorisationStatus === AUTHORISATION_STATUS.APPROVED || (data?.base64 || data?.url)) { 
        strokeColor = '#00BA32'; 
        percent = 100; 
        messageTooltip = 'This document has been approved by the director'; 
      }
      else if (authorisationStatus === AUTHORISATION_STATUS.VERIFYING) { 
        strokeColor = '#f49d00'; 
        percent = 66; 
        messageTooltip = 'This document needs to be approved by the director';
      }
      else if (authorisationStatus === AUTHORISATION_STATUS.DECLINED) { 
        strokeColor = '#ec5a54'; 
        percent = 33;
        messageTooltip = 'This document has been rejected by the director';
      }
      else if (authorisationStatus === AUTHORISATION_STATUS.VERIFY) { 
        strokeColor = '#f5f5f5';
        percent = 0;
        messageTooltip = 'Documents need to be uploaded';
      }
      else return null;

      return <Tooltip placement="topLeft" title={messageTooltip}>
            <ProgressCustom
              percent={percent}
              strokeColor={strokeColor}
              size={[300, 20]} 
              style={{ position: 'absolute', top: '70%', left: '22%', maxWidth: '65%', 
                display: !hideProcessBar ? '' : 'none' }}/>
          </Tooltip>
    };

    return (
      <GroupHorizontal>
        {DrawIcon()}
        <Upload
          {...componentProps}
          className="upload-director-doc "
          openFileDialogOnClick={!customAction}
        >
          { (data?.base64 || data?.url) ? (
            <div style={{ position: "relative" }}>
              {data?.fileExtension === "application/pdf" ? (
                <Image
                  src={documentIcon}
                  style={{ width: 50 }}
                  preview={false}
                />
              ) : (
                <Image
                  src={data?.base64 ?? data?.url}
                  style={{ width: 100 }}
                  preview={false}
                />
              )}
            </div>
          ) : (
            <Image
              src={upload}
              preview={false}
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#fff",
                padding: 10,
              }}
            />
          )}

          <div className="ml-2" ref={ref}>
            <p className="mb-0 text-white text-small">
              {getDesByType(data?.documentType ?? data?.type)}
            </p>
            <p
              className="mb-0 text-white  text-x-small text-underline"
              onClick={customAction}
            >
              {(data?.base64||data?.url)
                ? "Replace"
                : "choose a file (pdf, jpg, png of max size: 3mb)"}
            </p>
          </div>

          <DeleteTwoTone
            twoToneColor={'white'} 
            style={{ right: '5%', top: '35%', position: 'absolute', display: (data?.base64 || data?.url) ? '' : 'none' }} 
            onClick={onRemove} />

          {DrawProcessBar()}
        </Upload>
      </GroupHorizontal>
    );
  }
);

export default UploadDocumentComponent;
