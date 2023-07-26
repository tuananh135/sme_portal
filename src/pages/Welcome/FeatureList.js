import { Card, Image, Tooltip } from "antd";
import React, { useState } from "react";
import styled, { css } from 'styled-components';
import { ReactComponent as CardIcon } from "assets/images/icon-card.svg";
import { ReactComponent as ClinicIcon } from "assets/images/icon-clinic.svg";
import { ReactComponent as MixIcon } from "assets/images/icon-mix.svg";
import { ReactComponent as DeathIcon } from "assets/images/icon-death.svg";
import { ReactComponent as Activ8Icon } from "assets/images/icon-3years.svg";
import { ReactComponent as WellnessIcon } from "assets/images/icon-wellness.svg";
import Active8InfoModal from "./component/Active8InfoModal";
import { ReactComponent as InfoIcon } from "assets/images/icon-info.svg";

const Wrapper = styled.ul`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  list-style-type: none;
  white-space: nowrap;
  overflow-x: auto;
  display: flex;
  align-items: center;
  padding-left: 30%;
  margin-right: 30vw;
  height: 230px;
  

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    margin-right: 0;
    padding-left: 5px;
  }
`;

const CardWrapper = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 60vw;
  max-width: 300px;
  margin-right: 10px;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  text-align: center;
  background: white;
  height: 100%;
`;

const IconWrapper = styled.div` 
`;

const Item = styled.li`
  display: inline;
  height: 215px;
  div svg {
    margin: 8px 0px 8px 0px;
  }
`;

const MobileItem = styled.li`
  display: inline;
  height: 215px;
  div svg {
    margin: 8px 0px 8px 0px;
    height: 35px;
    width: 35px;

    /* New condition */
    ${props =>
      props.hasActiv8Icon &&
      css`
        height: 45px;
        width: 45px;
      `}

      ${props =>
        props.hasDeathIcon &&
        css`
          height: 40px;
          width: 40px;
        `}
  }`;


const NameText = styled.div`
  white-space: normal;
`;
const DescText = styled.div`
  white-space: normal;
`;

function FeatureList({ isMobile }) {
  const [showActiv8Info, setShowActiv8Info] = useState(false);

  const featureList = [
    {
      name: "e-Medical Card with Cashless Admission",
      desc: "Cashless admission to our list of panel hospitals or pay-first-claim-later (reimbursement basis).",
      icon: <CardIcon />,
    },
    {
      name: "Outpatient Clinical Visit",
      desc: "Cashless visit to panel clinics including General Practitioner (GP) and Specialist Care (SP).",
      icon: <ClinicIcon />,
    },
    {
      name: "Mix & match",
      desc: "Customise group term life, group medical and group outpatient clinical for your employees based on your budget.",
      icon: <MixIcon />,
    },
    {
      name: "3 Years Guarantee",
      desc: "Worried about increasing insurance premium upon renewal? Sign up for our group medical plan with fixed yearly payable premium for 3 years (premium guarantee).",
      icon: <DeathIcon />,
    },
    {
      name: "Wellness Reward Program",
      desc: (
        <span style={{ textAlign: 'justify' }}>
        A reward program based on your employees’ health assessment. Healthy employees will be rewarded up to 100% additional annual limit.{' '}
        <InfoIcon
        onClick={() => setShowActiv8Info(true)}
        className="ml-1 cursor-pointer"
        style={{
            margin: "-3px",
            width: "10px",
            height: "10px",
        }}/>
        </span>
      ),
      icon: <Activ8Icon />,
    },
    {
      name: "Death / TPD",
      desc: "Basic sum assured payable upon the untimely Death / Disability of the insured employee.",
      icon: <WellnessIcon />,
    },
  ];

  const iconStyle = isMobile
  ? {
      height: "50px",
    }
  : {};

  return (
    <div style={!isMobile ? { display: "grid", justifyContent: "center" } : {}}>
      {
        isMobile ?<Wrapper>
        {featureList?.map((item, index) => (
          <MobileItem key={index} hasActiv8Icon={item.name === "Wellness Reward Program"} hasDeathIcon={item.name === "3 Years Guarantee"}>
            <CardWrapper>
              <IconWrapper style={iconStyle}>
                {item.icon}
              </IconWrapper>
              <DescText className="text-bold">{item.name}</DescText>
              <DescText>{item.desc}</DescText>
            </CardWrapper>
          </MobileItem>
        ))}
        <Active8InfoModal show={showActiv8Info} setShow={setShowActiv8Info} />
      </Wrapper>
          :
          (
            Array.apply(0, new Array(featureList.length / 3)).map((i, ind) => (
              <Wrapper key={ind}>
                <Item>
                  <CardWrapper>
                    {featureList[ind * 3].icon}
                    <DescText className="text-bold">{featureList[ind * 3].name}</DescText>
                    <DescText>{featureList[ind * 3].desc}</DescText>
                  </CardWrapper>
                </Item>
                <Item>
                  <CardWrapper>
                    {featureList[ind * 3 + 1].icon}
                    <DescText className="text-bold">{featureList[ind * 3 + 1].name}</DescText>
                    <DescText>{featureList[ind * 3 + 1].desc}</DescText>
                  </CardWrapper>
                </Item>
                <Item>
                  <CardWrapper>
                    {featureList[ind * 3 + 2].icon}
                    <DescText className="text-bold">{featureList[ind * 3 + 2].name}</DescText>
                    <DescText>{featureList[ind * 3 + 2].desc}</DescText>
                  </CardWrapper>
                </Item>
                < Active8InfoModal show={showActiv8Info} setShow={setShowActiv8Info} />
              </Wrapper>
            ))
          )
      }
    </div>
  );
}

export default FeatureList;
