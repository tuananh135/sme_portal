import { Col, Modal, Row } from 'antd'
import React from 'react'
import { WarningOutlined } from '@ant-design/icons'
import PrimaryButton from 'common/components/Button/PrimaryButton'
import styled from 'styled-components'

const InfoTitle = styled.div`
  font-weight: bolder;
  font-size: 18px;
  margin: 10px;
`
const InfoText = styled.div`
  font-size: 16px;
  margin: 10px;
`

function ConfirmModal({ isVisible, icon, title, confirmation, okText, cancelText, onclose, onSubmit, onCancel, cancelStyle, okStyle }) {
  return (
    <Modal open={isVisible} footer={null} style={{ width: '80%', maxWidth: '300px', textAlign: 'center' }} onCancel={onclose} className="border-round">
      <Row>
        <Col span={24}>
          {icon}
          <InfoTitle className="error-text text-small px-3 py-3 border-round">{title}</InfoTitle>
          <InfoText className="text-small text-bold">{confirmation}</InfoText>
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={24} className="mb-3">
          <PrimaryButton text={cancelText} rootclass="w-80" style={cancelStyle} onClick={onCancel} />
        </Col>
        <Col span={24}>
          <PrimaryButton text={okText} rootclass="w-80" style={okStyle} onClick={onSubmit} />
        </Col>
      </Row>
    </Modal>
  )
}

export default ConfirmModal
