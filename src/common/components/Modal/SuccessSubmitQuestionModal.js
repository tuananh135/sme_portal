import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Button, Divider, Form, Input, Radio, Select, Checkbox, Image, Modal } from "antd";
import { ReactComponent as EmployeeIcon } from "assets/images/icon-employeeonly.svg";
import { ReactComponent as EmployeeSelectedIcon } from "assets/images/icon-employeeonly-select.svg";
import { ReactComponent as EmployeeAndFamilyIcon } from "assets/images/icon-employee-family.svg";
import tick from "assets/images/animation-tick.gif";
import { useNavigate, useParams } from "react-router-dom";
import { PAGE_LINK } from "common/constants/pagelinks";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const PageText = styled.div`
  justify-content: center;
  color: white;
  margin-top: 30px;
  margin-bottom: 30px;
`;
const FormContainer = styled.div`
    width: 80%;
    margin-bottom: 200px;
    max-width: 600px;
`
const GroupHorizontal = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

`
const ModalCustom = styled(Modal)`
  margin: 0!important;
  .ant-modal, .ant-modal-content {
    text-align: -webkit-center;
    height: 100vh;
    width: 100vw;
    top: 0;
    position:fixed;
    background: #414042;
  }
`;

function SuccessSubmitQuestionModal({ show, setModalShow, onClosePreviousPage }) {
 
    return (
    <ModalCustom
        open={show}
        onCancel={() => {
          setModalShow(false);
          onClosePreviousPage(); // close the previous page before hiding the modal
        }}       
        className="text-white  d-flex submit-question"
      footer={null}>
        <Wrapper>
            <ChatIcon />
            <PageText className="text-large text-center">
            Enquiry successfully sent.<br/>Our officer will get in touch with you in 1 working day
            </PageText>
            <div className="w-100 text-center">
                <Image src={tick} style={{ width: '50%' }} preview={false}/>
            </div>
            <PrimaryButton text="OKAY" style={{ minWidth: 200 }} onClick={() =>{setModalShow(false);onClosePreviousPage()}} />
            <FormContainer>
            </FormContainer>
        </Wrapper>
        </ModalCustom>
    );
}

export default SuccessSubmitQuestionModal;
