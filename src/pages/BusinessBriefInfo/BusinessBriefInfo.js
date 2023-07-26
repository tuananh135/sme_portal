import { Select } from "antd";
import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { PAGE_LINK } from "common/constants/pagelinks";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  align-items: center;
  text-align: center;
`;
const StyledSelect = styled(Select)`
  margin-bottom: 24px !important;
  margin-left:16px!important;
  margin-right:16px!important;
  width:70%;
  min-width:300px;
  max-width: 600px;
`;

function BusinessBriefInfo() {
  const navigate = useNavigate();
  const reAnalyse = () =>{
    navigate(PAGE_LINK.BUDGET_OFFER.NAME,{
      state:{
        type:1
      }
    });
  }
  return (
    <Wrapper className="d-flex d-flex-c">
      <ChatIcon width={50} className="mb-5" />
      <div className="text-x-large text-white mb-5">
        Help us to know you better. <br /> This is to make sure we are giving{" "}
        <br /> the best deal for you
      </div>
      <StyledSelect
        placeholder="Choose your Business Industry"
        allowClear
        options={[
          {
            value: "lucy",
            label: "Lucy",
          },
        ]}
        className="text-left"
      />
      <StyledSelect
        placeholder="Select your Location"
        allowClear
        options={[
          {
            value: "lucy",
            label: "Lucy",
          },
        ]}
        className="text-left"
      />
      <StyledSelect
        placeholder="Business Type"
        allowClear
        options={[
          {
            value: "lucy",
            label: "Lucy",
          },
        ]}
        className="text-left"
      />
      <PrimaryButton rootclass="half-width-button" text={"Analyse"} onClick={()=>reAnalyse()}/>
    </Wrapper>
  );
}

export default BusinessBriefInfo;
