import { Checkbox, Col, Image, Radio } from "antd";
import React from "react";
import { ReactComponent as DoneIcon } from "assets/images/icon-tick.svg";
import { ReactComponent as BlankIcon } from "assets/images/icon-round-blank.svg";
import styled from "styled-components";

const Wrapper = styled.div`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const VerticalLineCol = styled(Col)`
  position: relative;
  border-radius: 100%;
  width: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #fff;
  z-index: 2;
  &:before {
    position: absolute;
    border: 1px dashed ${props => props.isDone? "#91c654":"#999"};
    width: 0;
    height: 120px;
    display: ${props => props.isLast? "none":"block"};
    content: "";
    left: 50%;
    z-index: 1;
    top: 40px;
    margin-left: -1px;
  }
`;

function StepComponent({ data, index, isDone, disabled, isLast, ...rest }) {
  return (
    <Wrapper {...rest} onClick={() => data.action(index)} disabled={disabled}>
      <Col span={4} className="d-flex">
        {data?.icon}
      </Col>
      <Col
        span={18}
        className="d-flex-c px-3"
        style={{ justifyContent: "center" }}
      >
        <div className="text-small text-gray">{`Step ${index + 1}`}</div>
        <div className="text-small text-black">{data.desc}</div>
      </Col>
      <VerticalLineCol
        span={2}
        style={{ alignSelf: "center" }}
        isLast={isLast}
        isDone={isDone}
      >
        {isDone ? <DoneIcon /> : <BlankIcon />}
      </VerticalLineCol>
    </Wrapper>
  );
}

export default StepComponent;
