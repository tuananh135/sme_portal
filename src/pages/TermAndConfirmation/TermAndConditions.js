import { Button, Modal, Row } from "antd";
import styled from "styled-components";

//#region Custom theme
const ModalBody = styled(Modal)`
  margin: 0 !important;
  .ant-modal,
  .ant-modal-content {
    text-align: -webkit-center;
    height: 100vh;
    width: 100vw;
    top: 0;
    position: fixed;
    background: white;
  }
`;
const ModalContent = styled(Modal)``;
//#endregion

export default function TermAndConditions() {
  const onClose = () => {
    console.log("close");
  };
  return (
    <ModalBody
      open={true}
      className="text-white d-flex submit-question"
      footer={null}
      closable={null}
    >
      <ModalContent
        open={true}
        closable={false}
        bodyStyle={{}}
        onCancel={onClose}
        footer={null}
      >
        <Row
          style={{
            justifyContent: "center",
            fontSize: "initial",
            margin: "0vh 0vw 0vh 0vw",
          }}
        >
          <strong>TERMS & CONDITIONS</strong>
        </Row>
        <Row
          style={{
            textAlign: "center",
            fontSize: "small",
            margin: "2vh 0vw 3vh 0vw",
          }}
        >
          I/We agree that any personal information collected by the Company may
          be held, used and disclosed by the Company to
          individuals/organizations, affiliates related to and associated with
          the Company or third parties (within or outside of Malaysia),
          including reinsurance and claims investigation companies and industry
          associations/ federations) for processing this application and
          providing subsequent service for this application and to communicate
          with me/us for other products and services. wWe understand that /We
          have a right to access and request the correction of my/our personal
          information held by the Company. Such request can be made to the
          Company's Customer Service Center
        </Row>

        <Row style={{ justifyContent: "center" }}>
          <Button
            style={{
              borderRadius: "5px",
              width: "90%",
              backgroundColor: "#ec5a54",
              borderColor: "transparent",
              color: "#FFFFFF",
            }}
            size={"large"}
          >
            I UNDERSTAND
          </Button>
        </Row>
      </ModalContent>
    </ModalBody>
  );
}
