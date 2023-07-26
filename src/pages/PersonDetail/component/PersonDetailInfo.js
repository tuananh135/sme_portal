import { Button, Checkbox, Col, Divider, Row } from "antd";
import CancelButton from "common/components/Button/CancelButton";
import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { PAGE_LINK } from "common/constants/pagelinks";
import { sortByProps } from "common/utils/objectUtils";
import { CategoryStateContext } from "contexts/CategoryContext";
import moment from "moment";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { ReactComponent as RemoveIcon } from "assets/images/icon-remove.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const PageText = styled.div`
  font-weight: bold;
  justify-content: center;
  color: white;
  margin-top: 30px;
  margin-bottom: 50px;
`;

const InfoCard = styled.div`
  padding: 15px;
  background-color: #45474e;
  border: 1px solid #63636d;
  border-radius: 3px;
  margin-bottom: 30px;
`
const RemoveStyledIcon = styled(RemoveIcon)`
  height: 16px;
  width: 16px;
  position: absolute;
  top: -6px;
  right: 4px;
`;

function PersonDetailInfo({ data, onSave, onEdit, isSubmitting }) {
  const { countryList } = useContext(CategoryStateContext)
  const [agree, setAgree] = useState(false);
  const isMalaysian = data.citizen === "MYS" ? true : false;

  function handleRemoveDependent(index) {
    const newData = {...data}; // Create a copy of the data object
    newData.dependents.splice(index, 1); // Remove the dependent at the specified index
    // Update the data object with the new value
    // ...
  }
  return (
    <Wrapper>
      <ChatIcon />
      <PageText className="text-x-large text-center">
        Please review your personal <br />
        details here
      </PageText>
      <div className="w-70 text-white person-detail-info max-width-input">
        <h4 className="text-white">Employee</h4>
        <InfoCard>
          <Col className="mb-4" span={24}>
            <label className="text-x-small text-brown">Full Name</label>
            <div className="text-small">{data?.name}</div>
          </Col>
          <Col className="mb-4" span={24}>
            <label className="text-x-small text-brown">Citizen</label>
            <div className="text-small">{data.citizen === "MYS" ? "Malaysia" : countryList.find(i => i.isO_Cd === data?.nationality)?.country_Nm}</div>
          </Col>
          {isMalaysian && (
            <Col className="mb-4" span={24}>
              <label className="text-x-small text-brown">NRIC</label>
              <div className="text-small">{data?.nric}</div>
            </Col>
          )}
          {!isMalaysian && (
            <>
              <Col className="mb-4" span={24}>
                <label className="text-x-small text-brown">Date of Birth</label>
                <div className="text-small">{data?.dateOfBirth}</div>
              </Col>
              <Col className="mb-4" span={24}>
                <label className="text-x-small text-brown">Gender</label>
                <div className="text-small">{data?.gender}</div>
              </Col>
              <Col className="mb-4" span={24}>
                <label className="text-x-small text-brown">Passport</label>
                <div className="text-small">{data?.passport}</div>
              </Col>
              <Col className="mb-4" span={24}>
                <label className="text-x-small text-brown">Working Visa Issue Date</label>
                <div className="text-small">{data?.visaIssueDate_display ? moment(data?.visaIssueDate_display).format("DD/MM/YYYY") : null}</div>
              </Col>
              <Col className="mb-4" span={24}>
                <label className="text-x-small text-brown">Current Working Visa Expiry</label>
                <div className="text-small">{data?.visaExpiry_display ? moment(data?.visaExpiry_display).format("DD/MM/YYYY") : null}</div>
              </Col>
            </>
          )}

          <Col className="mb-4" span={24}>
            <label className="text-x-small text-brown">Bank Name</label>
            <div className="text-small">{data?.bankName}</div>
          </Col>
          <Col className="mb-4" span={24}>
            <label className="text-x-small text-brown">Bank Account</label>
            <div className="text-small">{data?.bankAccount}</div>
          </Col>

          <Col className="mb-4" span={24}>
            <label className="text-x-small text-brown">No. Of Dependent</label>
            <div className="text-small">
              {data?.dependents?.length > 0 &&
                data?.dependents[0]?.noDependent > 0
                ? `${data?.dependents?.length} Dependents`
                : "0"}
            </div>
          </Col>
          <Col className="mb-4" span={24}>
            <label className="text-x-small text-brown">Email</label>
            <div className="text-small">{data?.email}</div>
          </Col>
          <Col className="mb-4" span={24}>
            <label className="text-x-small text-brown">Address</label>
            {data?.address?.addressLine1 && (
              <div className="text-small mb-1">{data?.address?.addressLine1}</div>
            )}
            {data?.address?.addressLine2 && (
              <div className="text-small mb-1">{data?.address?.addressLine2}</div>
            )}
            {data?.address?.addressLine3 && (
              <div className="text-small mb-1">{data?.address?.addressLine3}</div>
            )}
          </Col>
          <Row>
            {" "}
            <Col className="mb-4" span={12}>
              <label className="text-x-small text-brown">Postal Code</label>
              <div className="text-small">{data?.address?.postalCode}</div>
            </Col>
            <Col className="mb-4" span={12}>
              <label className="text-x-small text-brown">City</label>
              <div className="text-small">{data?.address?.city}</div>
            </Col>
          </Row>
          <Row>
            <Col className="mb-4" span={12}>
              <label className="text-x-small text-brown">State</label>
              <div className="text-small">{data?.address?.state}</div>
            </Col>
            <Col className="mb-4" span={12}>
              <label className="text-x-small text-brown">Country</label>
              <div className="text-small">{data?.address?.country}</div>
            </Col>
          </Row>
          <Col className="mb-4" span={12}>
            <label className="text-x-small text-brown">Phone Number</label>
            <div className="text-small">{data?.mobileNumber}</div>
          </Col>
          {!!data?.pepDeclaration?.member && !!data?.pepDeclaration?.member?.role && (
            <>
              <Divider plain className="text-white"></Divider>
              <Row>
                <Col className="mb-4" span={12}>
                  <label className="text-x-small text-brown">PEP Status</label>
                </Col>
                <Col className="mb-4" span={12}>
                  <div className="text-small text-right">YES</div>
                </Col>
              </Row>
              <Row>
                <Col className="mb-4" span={12}>
                  <label className="text-x-small text-brown">
                    Role in organization/party/association
                  </label>
                </Col>
                <Col className="mb-4" span={12}>
                  <div className="text-small text-right">{data?.pepDeclaration?.member?.role}</div>
                </Col>
              </Row>
              <Row>
                <Col className="mb-4" span={12}>
                  <label className="text-x-small text-brown">
                    Organization/party/association Name
                  </label>
                </Col>
                <Col className="mb-4" span={12}>
                  <div className="text-small text-right">{data?.pepDeclaration?.member?.organization}</div>
                </Col>
              </Row>
              <Row>
                <Col className="mb-4" span={12}>
                  <label className="text-x-small text-brown">Position Held</label>
                </Col>
                <Col className="mb-4" span={12}>
                  <div className="text-small text-right">{data?.pepDeclaration?.member?.positionHeld}</div>
                </Col>
              </Row>
              <Row>
                <Col className="mb-4" span={12}>
                  <label className="text-x-small text-brown">No of Year</label>
                </Col>
                <Col className="mb-4" span={12}>
                  <div className="text-small text-right">{data?.pepDeclaration?.member?.year}</div>
                </Col>
              </Row>
            </>
          )}
          {data?.healthQuestions &&
            data.underwritingQuestion &&
            sortByProps(data?.healthQuestions, "title")?.map(
              (question, index) => {
                return (
                  <div key={index}>
                    {index === 0 && <Divider plain className="text-white"></Divider>}
                    <Col className="mb-4" span={24}>
                      <label className="text-x-small text-brown">
                        {question?.title}
                      </label>
                      <div className="text-small">{question?.desc}</div>
                    </Col>
                    <Col className="mb-4" span={24}>
                      <label className="text-x-small text-brown">Answer</label>
                      <div className="text-small">{question?.answer ?? "No"}</div>
                    </Col>
                  </div>
                );
              }
            )}
        </InfoCard>
        {data?.dependents?.noDependent > 0 && 
          data?.dependents?.map((dependent, index) => {
            return (
              <div key={index} style={{position: 'relative'}}>
          <h4 className="text-white" style={{display: 'inline-block', marginRight: '10px'}}>Dependent #{index + 1}</h4>
          {index+1 > 0 && (
            <RemoveStyledIcon
              className="cursor-pointer"
              style={{position: 'absolute', top: '3%', right: '-4px', transform: 'translateY(-50%)'}}
              onClick={() => {
                handleRemoveDependent(index);
              }}
            />
          )}
     
          <InfoCard>
      
                    <Col className="mb-4" span={24}>
                      <label className="text-x-small text-brown">
                        Dependent's Full Name
                      </label>
                      <div className="text-small">
                        {dependent?.name ?? dependent?.fullname}
                      </div>
                    </Col>
                    <Col className="mb-4" span={24}>
                      <label className="text-x-small text-brown">
                        Relationship
                      </label>
                      <div className="text-small">{dependent?.relationship}</div>
                    </Col>
                    <Col className="mb-4" span={24}>
                      <label className="text-x-small text-brown">Nationality</label>
                      <div className="text-small">
                        <div className="text-small">
                          {countryList.find(i => i.isO_Cd === dependent?.citizen)?.country_Nm}
                        </div>
                      </div>
                    </Col>
                    <Col className="mb-4" span={24}>
                      <label className="text-x-small text-brown">NRIC</label>
                      <div className="text-small">{dependent?.nric}</div>
                    </Col>
                    <Divider plain className="text-white"></Divider>
                  
              {dependent?.healthQuestions &&
                data.underwritingQuestion &&
                sortByProps(dependent?.healthQuestions, "title")?.map(
                  (question, index) => {
                    return (
                      <div key={index}>
                        {index === 0 && <Divider plain className="text-white"></Divider>}
                        <Col className="mb-4" span={24}>
                          <label className="text-x-small text-brown">
                            {question?.title}
                          </label>
                          <div className="text-small">{question?.desc}</div>
                        </Col>
                        <Col className="mb-4" span={24}>
                          <label className="text-x-small text-brown">Answer</label>
                          <div className="text-small">{question?.answer ?? "No"}</div>
                        </Col>
                      </div>
                    );
                  }
                )}
    
          </InfoCard>
          </div>
            );
          })}

        {data?.pepDeclaration?.family.length > 0 && 
          data?.pepDeclaration?.family.map((dependent, index) => {
            return (
              <div key={index} style={{position: 'relative'}}>
          <h4 className="text-white" style={{display: 'inline-block', marginRight: '10px'}}>PEP Family #{index + 1}</h4>
          {index+1 > 0 && (
            <RemoveStyledIcon
              className="cursor-pointer"
              style={{position: 'absolute', top: '3%', right: '-4px', transform: 'translateY(-50%)'}}
              onClick={() => {
                handleRemoveDependent(index);
              }}
            />
          )}
     
          <InfoCard>
              {
                (() => {
                  const IsPep = data?.pep;
                  if (IsPep === "Yes") {
                    const familyPep = data?.pepDeclaration?.family ?? [];
                    if (familyPep) {
                    return (
                      <>
                        <Row>
                          <Col className="mb-4" span={12}>
                            <label className="text-x-small text-brown">PEP Status</label>
                          </Col>
                          <Col className="mb-4" span={12}>
                            <div className="text-small text-right">YES</div>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="mb-4" span={12}>
                            <label className="text-x-small text-brown">
                              Name
                            </label>
                          </Col>
                          <Col className="mb-4" span={12}>
                            <div className="text-small text-right">{familyPep[index]?.name}</div>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="mb-4" span={12}>
                            <label className="text-x-small text-brown">
                              NRIC
                            </label>
                          </Col>
                          <Col className="mb-4" span={12}>
                            <div className="text-small text-right">{familyPep[index]?.nric}</div>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="mb-4" span={12}>
                            <label className="text-x-small text-brown">
                              Role in organization/party/association
                            </label>
                          </Col>
                          <Col className="mb-4" span={12}>
                            <div className="text-small text-right">{familyPep[index]?.role}</div>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="mb-4" span={12}>
                            <label className="text-x-small text-brown">
                              Organization/party/association Name
                            </label>
                          </Col>
                          <Col className="mb-4" span={12}>
                            <div className="text-small text-right">{familyPep[index]?.organization}</div>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="mb-4" span={12}>
                            <label className="text-x-small text-brown">Position Held</label>
                          </Col>
                          <Col className="mb-4" span={12}>
                            <div className="text-small text-right">{familyPep[index]?.positionHeld}</div>
                          </Col>
                        </Row>
                      </>
                    )
                  } else {
                    return (<></>)
                  }
                }
                })()
              }

    
          </InfoCard>
          </div>
            );
          })}
        <Col>
          <Checkbox
            className="text-white text-x-small text-left mb-5 tune-confirm-checkbox"
            onChange={(e) => setAgree(e.target.checked)}
          >
            By ticking this box, I hereby acknowledge that I have read the
            <a
              href="https://www.tuneprotect.com/privacy-policy"
              target={"_blank"}
              className="text-primary"
            >
              {" "}
              Privacy policy
            </a>{" "}
            and have agreed to the
            <span className="text-primary"> Terms & Conditions</span> and I have
            consented to disclose my information to third parties for marketing
            purpose.
          </Checkbox>
        </Col>
        <div className="center-items d-flex-c w-100">
          <PrimaryButton
            rootclass="full-width-button my-3 w-80"
            text={"SAVE & CLOSE"}
            onClick={onSave}
            style={{
              backgroundColor: agree ? "#ec5a54" : "#9e9e9e",
              pointerEvents: agree ? "all" : "none",
            }}
            disabled={!agree}
            isLoading={isSubmitting}
          />
          <Button
            className="full-width-button w-80 mb-5 TuneTransparentButton"
            onClick={onEdit}
          >
            Edit
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}

export default PersonDetailInfo;
