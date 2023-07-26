import { Button, Col, Modal, Row } from "antd";
import React from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import PrimaryButton from "../Button/PrimaryButton";
import ChatIcon from "../ChatIcon/ChatIcon";

const InfoTitle = styled.div`
  font-weight: bolder;
  font-size: 18px;
  margin: 10px;
`;
const InfoText = styled.div`
  font-size: 14px;
  margin: 10px;
  font-weight:bold;
`;
const InfoModal = styled(Modal)`
  text-align: center !important;
`;
const NotiButton = styled(Button)`
  width: 100%;
`;
const StyledIcon = styled(ChatIcon)`
    top: -5px;
    left: 50%;
    transform: translate(-50%, -50%);
`

function NotificationModalWithImage({
  className,
  isVisible,
  icon,
  title,
  confirmation,
  buttonText,
  buttonClass,
  cancelButton,
  cancelButtonClass,
  onCancel,
  onClose,
  content,
}) {
  return (
    <InfoModal
      className={className}
      open={isVisible}
      centered
      footer={null}
      onCancel={onClose}
    >
    <ChatIcon width={60} height={60}/>
      <Row>
        <Col span={24}>
          {icon}
          <InfoTitle>{title}</InfoTitle>
          <InfoText>{confirmation}</InfoText>
          {content}
        </Col>
      </Row>
      <Row style={{ marginTop: 10,justifyContent: "space-between" }}>
        {cancelButton ? (
          <>
            <Col span={11}>
              <NotiButton
                className={cancelButtonClass}
                onClick={() => onCancel()}
                type="primary"
              >
                {cancelButton}
              </NotiButton>
            </Col>
            <Col span={11}>
              <NotiButton
                className={buttonClass}
                onClick={() => onClose()}
                type="primary"
              >
                {buttonText}
              </NotiButton>
            </Col>
          </>
        ) : (
          <Col span={24}>
            <PrimaryButton
              rootclass={buttonClass}
              onClick={() => onClose()}
              type="primary"
              text={buttonText}
            />
          </Col>
        )}
      </Row>
    </InfoModal>
  );
}

export default NotificationModalWithImage;
