import { Button, Col, Modal, Row } from "antd";
import React from "react";
import styled from "styled-components";

const InfoTitle = styled.div`
  font-weight: bolder;
  font-size: 18px;
  margin: 10px;
`;
const InfoText = styled.div`
  font-size: 16px;
  margin: 10px;
`;
const InfoModal = styled(Modal)`
  text-align: center !important;
  width: 50vw !important;
`;

function SuccessWithCustomActionModal({
  style,
  isVisible,
  icon,
  title,
  confirmation,
  onCancel,
  buttons,
  content,
}) {
  return (
    <InfoModal
      style={style}
      open={isVisible}
      centered
      footer={null}
      onCancel={onCancel}
    >
      <Row>
        <Col span={24}>
          {icon}
          <InfoTitle>{title}</InfoTitle>
          <InfoText>{confirmation}</InfoText>
          {content}
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        {buttons.map((button,index) => (
          <Col span={button.colSpan?? 12} className={button?.wrapperClass} key={index}>
            <Button
              className={button?.class}
              onClick={button?.action}
              type="primary"
              style={{ width: "100%" }}
            >
              {button?.text}
            </Button>
          </Col>
        ))}
      </Row>
    </InfoModal>
  );
}

export default SuccessWithCustomActionModal;
