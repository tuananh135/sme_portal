import { Col, Modal, Row } from "antd";
import React from "react";

function PEPDescriptionModal({ show, setShow }) {
  const hideModal = () => {
    setShow(false);
  };
  return (
    <Modal
      open={show}
      onOk={hideModal}
      onCancel={hideModal}
      okText="Ok"
      cancelText="Cancel"
      className="pep-desc w-90 d-flex max-width-input"
      footer={null}
    >
      <div className="text-small scroll-bar" style={{height:"100%", overflowY:"auto"}}>
        <b>Politically Exposed Persons (PEPS)</b> <br/><br/>
        <p>
          a) Foreign PEPs - individuals who are or who have been entrusted with
          prominent public functions by a foreign country. For example, Heads of
          State or Government, senior politicians, senior government, judicial
          or military officials, senior executives of state-owned corporations
          and important political party officials; or
        </p>
        <p>
          b) Domestic PEPs - individuals who are or have been entrusted
          domestically with prominent public functions. For example, Heads of
          State or Government, senior politicians, senior government (includes
          federal, state and local government), judicial or military officials,
          senior executives of state-owned corporations and important political
          party officials; or
        </p>
        <p>
          c) Persons who are or have been entrusted with a prominent function by
          an international organisation which refers to members of senior
          management. For example, directors, deputy directors and members of
          the Board or equivalent functions.
        </p>
        <br/>
        <b>
          <p> Family Members and Close Associates</p>
        </b>
        <br/>
        <p>
          a) family members - individuals who are related to a PEP either
          directly (consanguinity) or through marriage. This incluses parents*,
          siblings", spouse(s)*, child* or spouse's parents". (biological and
          non-biological relationship)
        </p>
        <p>
          b) close associates - any individual closely connected to a
          politically exposed person (PEP), either socially or professionally. A
          close associate in this context includes:
        </p>
        <br/>
        <Row>
            <Col span={2}>i.</Col>
            <Col span={22}>Extended family members, such as relatives (biological and
          non-biological relationship); or</Col>
        </Row>
        <Row>
            <Col span={2}>li.</Col>
            <Col span={22}>Financially dependent individuals (e.g. persons salaried by the
          PEP such as drivers, bodyguards, secretaries); or</Col>
        </Row>
        <Row>
            <Col span={2}>lii.</Col>
            <Col span={22}>Business partners or associates of the PEP; or Iv. Prominent
          members of the same organisation as the PEP; or</Col>
        </Row>
        <Row>
            <Col span={2}>V.</Col>
            <Col span={22}>Individuals working closely with the PEP (e.g. work colleagues); or</Col>
        </Row>
        <Row>
            <Col span={2}>Vi.</Col>
            <Col span={22}> Close friends.</Col>
        </Row>
      </div>
    </Modal>
  );
}

export default PEPDescriptionModal;
