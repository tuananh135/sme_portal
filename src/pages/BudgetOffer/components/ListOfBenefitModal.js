import { Button, Checkbox, Col, Form, Image, Input, Modal, Row } from "antd";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {ReactComponent as DownloadIcon} from "assets/images/icon-benefit-download.svg";
import {ReactComponent as BenefitMedicalIcon} from "assets/images/icon-benefit-medical.svg";
import {ReactComponent as OutpatientBenefitIcon} from "assets/images/icon-benefit-outpatient.svg";
import {ReactComponent as BenefitDeathIcon} from "assets/images/icon-benefit-death.svg";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import MedicalCardBenefitsActiv8 from "assets/documents/PDS-GHS3YRT-English-4plan_vLY-v2.pdf";
import MedicalCardBenefits from "assets/documents/PDS-GHSYRT-English-4plans_vLY-v2.pdf";
import OutpatientBenefits from "assets/documents/PDS-GPSP-English.pdf";
import DeathNDisabilityBenefits from "assets/documents/PDS-GTL-Uniform-English-JA-0304_vLY-V4.pdf";
import { downloadFileOnClick } from "common/utils/browserUtils";

const ItemWrapper = styled.div`
  background: white;
  margin: 10px;
  padding: 16px 16px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;

`;

function ListOfBenefitModal({ show, setShow }) {
  const hideModal = () => {
    setShow(false);
  };

  const downloadAll = () =>{
    downloadFileOnClick(MedicalCardBenefitsActiv8,"MedicalCardBenefitsActiv8.pdf");
    downloadFileOnClick(MedicalCardBenefits,"MedicalCardBenefits.pdf");
    downloadFileOnClick(OutpatientBenefits,"OutpatientBenefits.pdf");
    downloadFileOnClick(DeathNDisabilityBenefits,"DeathNDisabilityBenefits.pdf");
  }
 
  const dataList = [
    {
      icon: <BenefitMedicalIcon height={40} width={40}/>,
      text: " MEDICAL CARD BENEFITS (3 YEARS PREMIUM GUARANTEE WITH ACTIV8)",
      action: (val) => {
        downloadFileOnClick(MedicalCardBenefitsActiv8,"MedicalCardBenefitsActiv8.pdf");
      },
    },
    {
      icon: <BenefitMedicalIcon height={40} width={40}/>,
      text: " MEDICAL CARD BENEFITS (YEARLY PREMIUM)",
      action: (val) => {
        downloadFileOnClick(MedicalCardBenefits,"MedicalCardBenefits.pdf");
      },
    },
    {
      icon: <OutpatientBenefitIcon height={40} width={40}/>,
      text: "GROUP OUTPATIENT CLINICAL BENEFIT",
      action: (val) => {
        downloadFileOnClick(OutpatientBenefits,"OutpatientBenefits.pdf");
      },
    },
    {
      icon: <BenefitDeathIcon height={40} width={40}/>,
      text: "DEATH & DISABILITY BENEFITS",
      action: (val) => {
        downloadFileOnClick(DeathNDisabilityBenefits,"DeathNDisabilityBenefits.pdf");
      },
    },
  ];
  return (
    <Modal
      open={show}
      onOk={hideModal}
      onCancel={hideModal}
      okText="Ok"
      cancelText="Cancel"
      className="save-quote text-white d-flex"
      footer={null}
      o
    >
      <ChatIcon width={50} className="mb-2" />
      <div className="mt-5 max-width-input">
        You can download the full list of benefit here
      </div>
      {dataList?.map((item) => (
        <ItemWrapper className="w-90 max-width-input text-x-small">
          <div className="w-15">{item?.icon}</div>
          <div className="text-bold px-2 text-left w-70">{item?.text}</div>
          <div className="w-15"><DownloadIcon className="text-primary text-large cursor-pointer" height={20} width={20} onClick={()=>item?.action()}/></div>
        </ItemWrapper>
      ))}
      <Button className="full-width-button w-30 mt-5 TuneTransparentButton" onClick={downloadAll}>
        Download all
      </Button>
    </Modal>
  );
}

export default ListOfBenefitModal;
