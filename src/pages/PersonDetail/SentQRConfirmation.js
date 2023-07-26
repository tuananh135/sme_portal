import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Button, Divider, Form, Input, Radio, Select, Checkbox, Image } from "antd";
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

function SentQRConfirmation() {
    const navigate = useNavigate();
    const {id} = useParams();
    return (
        <Wrapper>
            <ChatIcon />
            <PageText className="text-large text-center">
                An email is now successfully<br/>sent to your employee for them to fill up
            </PageText>
            <div className="w-100 text-center">
                <Image src={tick} style={{ width: '50%' }} preview={false}/>
            </div>
            <h3 className="text-success text-bold mb-5">SENT!</h3>
            <PrimaryButton text="NEXT" style={{ minWidth: 200 }} onClick={()=> navigate(`${PAGE_LINK.SELF_COMPLETE_EMP_RESULT.NAME}/${id}`)}/>
            <FormContainer>
            </FormContainer>
        </Wrapper>
    );
}

export default SentQRConfirmation;
