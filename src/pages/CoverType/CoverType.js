import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { ReactComponent as EmployeeIcon } from "assets/images/icon-employeeonly.svg";
import { ReactComponent as EmployeeSelectedIcon } from "assets/images/icon-employeeonly-select.svg";
import { ReactComponent as EmployeeAndFamilyIcon } from "assets/images/icon-employee-family.svg";
import { ReactComponent as EmployeeAndFamilySelectedIcon } from "assets/images/icon-employee-family-select.svg";
import { useNavigate } from "react-router-dom";
import { PAGE_LINK } from "common/constants/pagelinks";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const PageText = styled.div`
  font-weight: bold;
  justify-content: center;
  color: white;
  margin-top: 30px;
  margin-bottom: 30px;
`;

function CoverType() {
  const navigate = useNavigate();

  const [hovered, setHovered] = useState({
    employee: false,
    employeeAndFamily: false,
  });
  return (
    <Wrapper>
      <ChatIcon />
      <PageText className="text-x-large">
        Do you want this cover for...
      </PageText>
      <Button
      className="TuneCoverButton"
        icon={
          hovered?.employee ? (
            <EmployeeSelectedIcon style={{ height: "35", width :"50" }} />
          ) : (
            <EmployeeIcon style={{ height: "35", width :"50" }} />
          )
        }
        onMouseEnter={(prev) => setHovered({ ...prev, employee: true })}
        onMouseLeave={(prev) => setHovered({ ...prev, employee: false })}
        onClick={()=> navigate(PAGE_LINK.BUDGET_OFFER.NAME)}
      >
        Employees Only
      </Button>
      <Button className="TuneCoverButton"
        style={{ marginTop: "15px" }}
        icon={
            hovered?.employeeAndFamily ? (
              <EmployeeAndFamilySelectedIcon style={{ height: "35", width :"50" }} />
            ) : (
              <EmployeeAndFamilyIcon style={{ height: "35", width :"50" }} />
            )
          }
          onMouseEnter={(prev) => setHovered({ ...prev, employeeAndFamily: true })}
          onMouseLeave={(prev) => setHovered({ ...prev, employeeAndFamily: false })}
          onClick={()=> navigate(PAGE_LINK.BUDGET_OFFER.NAME)}
      >
        Employee with family
      </Button>
    </Wrapper>
  );
}

export default CoverType;
