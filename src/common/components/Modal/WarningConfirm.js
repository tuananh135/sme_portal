import React from "react";
import { Modal, Row } from "antd";

export default function WarningConfirm({ visible, ...rest }) {
    return (
        <Modal
            title={false}
            open={visible}
            wrapClassName="TuneWarningConfirm"
            footer={null}
            {...rest}>
            <Row>

            </Row>
        </Modal>)
}