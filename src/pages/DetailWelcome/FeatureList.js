import { Card, Image } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as CardIcon } from "assets/images/icon-card.svg";
import { ReactComponent as ClinicIcon } from "assets/images/icon-clinic.svg";
import { ReactComponent as MixIcon } from "assets/images/icon-mix.svg";
import { ReactComponent as DeathIcon } from "assets/images/icon-death.svg";
import { ReactComponent as Activ8Icon } from "assets/images/icon-3years.svg";
import { ReactComponent as WellnessIcon } from "assets/images/icon-wellness.svg";
import Active8InfoModal from "../Welcome/component/Active8InfoModal";
import { ReactComponent as InfoIcon } from "assets/images/icon-info.svg";

const Wrapper = styled.ul`
  list-style-type: none;
  white-space: nowrap;
  overflow-x: auto;
  display: flex;
  align-items: center;
  position: relative;
  bottom: 65%;
  padding-left: 20%;
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
`;

const Item = styled.li`
  display: inline;
`;

const NameText = styled.div`
  white-space: normal;
`;
const DescText = styled.div`
  white-space: normal;
`;

function FeatureList() {
  const [showActiv8Info, setShowActiv8Info] = useState(false);

  const featureList = [
    {
      name: "e-Medical Card with Cashless Admission",
      desc: "Cashless admission to our list of panel hospitals or pay-first-claim-later (reimbursement basis).",
      icon: <CardIcon />,
    },
    {
      name: "Outpatient clinical visit",
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
      name: "Death / TPD",
      desc: "Basic sum assured payable upon the untimely Death / Disability of the insured employee.",
      icon: <WellnessIcon />,
    },
  ];

  return (
    <Wrapper>
      {featureList?.map((item) => (
        <Item>
          <CardWrapper>
            {item.icon}
            <DescText className="text-bold">{item.name}</DescText>
            <DescText>{item.desc}</DescText>
          </CardWrapper>
        </Item>
      ))}
      <Active8InfoModal show={showActiv8Info} setShow={setShowActiv8Info} />
    </Wrapper>
  );
}

export default FeatureList;
