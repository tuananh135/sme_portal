import { Modal, Row } from "antd";
import PrimaryButton from "common/components/Button/PrimaryButton";
import React from "react";

function PersonalInformationTerms({onNext}) {
  return (
    <Modal
      open={true}
      className="personal-terms-modal w-90 d-flex max-width-input"
      footer={null}
    >
      <div
        className="text-small scroll-bar text-center"
        style={{ height: "100%", overflowY: "auto", color:"black" }}
      >
        <div className="text-large text-bold pb-3">TERMS & CONDITIONS</div>
        <div>
          I/We agree that any personal information collected by the Company may
          be helD, used and disclosed by the Company to individuals /
          organizations, affiliates related to and associated with the Company
          or third parties (within or outside of Malaysia), including
          reinsurance and claims investigation companies and industry
          associations / federations),for processing this application and
          providing subsequent service for this application and to communicate
          with me / us for other products and services. I / We understand that I
          / We have a right to access and request the correction of my / our
          personal information held by the Company。Such request can be made to
          the Company's Customer Service Center
        </div>
        <Row style={{ margin: "3vh 0vw 3vh 0vw", justifyContent: "center" }}>
        <PrimaryButton
          text={"I UNDERSTAND"}
          onClick={onNext}
          rootclass="half-width-button"
        />
      </Row>
      </div>

    </Modal>
  );
}

export default PersonalInformationTerms;
