import chatImage from "assets/images/nina-small.png";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Button, Checkbox, Image } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { PAGE_LINK } from "common/constants/pagelinks";
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";
import SubmitQuestionModal from "common/components/Modal/SubmitQuestionModal";
import { EmpGroupDispatchContext, EmpGroupStateContext } from "contexts/EmpGroupContext";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";

const FormCard = styled.div`
  border-radius: 10px;
  max-height: 60vh;
  padding: 0 15px;
  background-color: #fff;
  overflow-y: auto;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const FormContainer = styled.div`
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 15px;
  max-width: 1200px;
`;
const GroupHorizontal = styled.div`
  display: flex;
  flex-direction: row;
`;
function TermAndConfirmation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agreed, setAgreed] = useState(false);
  const { empGroupData } = useContext(EmpGroupStateContext);
  const { updateEmpGroupData } = useContext(EmpGroupDispatchContext);
  const [showQuestion, setShowQuestion] = useState(false);

  return (
    <Wrapper>
      <Image
        preview={false}
        width={60}
        style={{ marginTop: "5vh" }}
        src={chatImage}
        onClick={() => setShowQuestion(true)}
      />
      <StepProgressTrigger className="mt-2 mb-3"/>
      <FormContainer>
        <FormCard className="scroll-bar">
          <div className="text-center px-5 pt-5 text-bold mb-4">
            Declaration
          </div>
          <div className="text-bold text-x-small mb-3">
            We hereby declare, to the best of our knowledge and belief, that the
            statements made below together with all other documents submitted in
            connection herewith are true and complete.
          </div>
          <div className="text-bold text-x-small mb-3">
            We understand TPV reserves the right to cancel the policy/ cover in
            the event incorrect information/documents shared.
          </div>
          <GroupHorizontal className="text-x-small mb-3">
            <div className="mr-2">1.</div>
            <div>
              We understand the contents of this replication including all
              important notices therein and we have fully and accurately
              answered all of the questions in this application and other
              questions asked by Tune Protect Ventures Sdn Bhd (TPV), if any,
              after having fully understood the questions. In the event of any
              change to the health condition of any applicants from the date of
              this declaration until the issuance of the Policy and we choose to
              withdraw this application, we allow TPV to deduct any incurred
              expenses from the premiums paid.
              <br />
              We understand that the insurance cover will not commence until
              this application has been officially accepted and a Policy
              Contract indicating cover has been issued."
            </div>
          </GroupHorizontal>

          <GroupHorizontal className="text-x-small mb-3">
            <div className="mr-2">2.</div>
            <div>
              We hereby confirm that we have obtained the authorization from all
              applicants to authorise TPV to seek medical information from any
              doctor, clinic, hospital or organization that has records or
              information of their health and medical history We confirm that
              they irrevocably authorise any organization, institution or
              individual that has any record or knowledge of their health and
              medical history or treatment or advice that has been or many
              hereafter be consulted. any personal information or detail of
              related illness/ accident/injury, to disclose to TPV or its
              representatives such information.
            </div>
          </GroupHorizontal>

          <GroupHorizontal className="text-x-small mb-3">
            <div className="mr-2">3.</div>
            <div>
              We understand the Privacy Notice on TPV's website and understand
              and agree that any personal information collected by TPV (whether
              contained in this application or otherwise obtained) may be held,
              used and disclosed by TPV to individuals/organizations, affiliates
              related to and associated with TPV or third parties (within or
              outside of Malaysia), including reinsurers, claims and other
              services providers, and industry associations/federations for the
              purposes of processing and providing subsequent service for this
              application and to communicate with the applicants for other
              products and services . We confirm the applicants understand that
              they have a right to access and request the correction of their
              personal information held by TPV. Such request can be made via
              email.
            </div>
          </GroupHorizontal>

          <GroupHorizontal className="text-x-small mb-3">
            <div className="mr-2">4.</div>
            <div>
              We understand that TPV will not provide any insurance cover and/or
              be liable to pay any claim/payment or provide any benefit to the
              extent that the provision of such benefit would expose them to any
              sanction, prohibition or restriction, relations with designated
              persons, entities, organizations, countries or governments,
              including, Malaysian Ministry of Home Affairs, United Nations
              Resolutions and the United States Department of the Treasury lists
              of Specially Designated Nationals and Blocked Persons.
              <br />
              We hereby consent and authorise TPV to use the beneficial owner's
              personal information for purposes of CTOS screening.{" "}
            </div>
          </GroupHorizontal>

          <GroupHorizontal className="text-x-small mb-3">
            <div className="mr-2">5.</div>
            <div>
              I understand and acknowledge that in the event of any overdue
              payment or shortage of payment in the future due to employee
              movement or due to any other reasons, I agree that the effective
              coverage period of the policy will be shortened in proportionate
              to the total premium amount paid.
            </div>
          </GroupHorizontal>
        </FormCard>
        <div className="px-2 py-2">
          <Checkbox
            className="tune-confirm-checkbox"
            checked={empGroupData?.isAgreeTermCondition||agreed}
            onChange={(e)=>setAgreed(e.target.checked)}
          >
            <span className="text-white text-x-small">
              I Agree with all the Terms & Conditions above.
            </span>
          </Checkbox>
        </div>
        <div className="text-center">
          <Button
            className="half-width-button"
            style={{
              backgroundColor: empGroupData?.isAgreeTermCondition||agreed ? "#ec5a54" : "#9e9e9e",
              color: "white",
              height: "40px",
              borderRadius: "5px",
              border: "0px",
              pointerEvents: empGroupData?.isAgreeTermCondition||agreed ? "all" : "none",
            }}
            type="primary"
            onClick={async (e) => {
                var rs = await EmployeeGroupService.AgreeTermAndCondition(id);
                if (rs) {
                  updateEmpGroupData(prev=> ({...prev,isAgreeTermCondition:true}))
                  navigate(`${PAGE_LINK.PAYMENT_TYPE.NAME}/${id}`)
                }
              } 
            }
          >
            Proceed
          </Button>
          {!agreed && (
            <p className="mt-2 text-white text-x-small">
              *You need to agree with the term condition to proceed
            </p>
          )}
        </div>
      </FormContainer>
      <SubmitQuestionModal
        show={showQuestion}
        setShow={setShowQuestion}
      ></SubmitQuestionModal>
    </Wrapper>
  );
}

export default TermAndConfirmation;
