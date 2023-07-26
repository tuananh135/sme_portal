import { Modal } from 'antd'
import React from 'react'
import PersonDetailInfo from './component/PersonDetailInfo'

function PersonInfoModal({isShow, onClose, onEdit, data}) {
  return (
    <Modal
      open={isShow}
      onOk={onClose}
      onCancel={onClose}
      okText="Ok"
      cancelText="Cancel"
      className="person-info-detail text-white d-flex"
      footer={null}
    >
        <PersonDetailInfo onEdit={onEdit} onSave={onClose} data={data}/>
    </Modal>
  )
}

export default PersonInfoModal