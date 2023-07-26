import { Col, Row } from 'antd'
import React from 'react'
import { ExclamationCircleTwoTone } from "@ant-design/icons";

function ErrorRow({text}) {
  return (
      <Row style={{lineHeight:5}}>
          <Col span={2} className='error-row-icon-wrapper'>
          <ExclamationCircleTwoTone twoToneColor='red'/>
          </Col>
          <Col span={22}  className='error-row-content-wrapper'>
          <div>{text}</div>
          </Col>
      </Row>
  )
}

export default ErrorRow