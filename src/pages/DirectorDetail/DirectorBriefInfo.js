import { Col, Divider, Row } from "antd";
import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import React from "react";
import styled from "styled-components";
import { ReactComponent as EditIcon } from "assets/images/icon-edit.svg";

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

const FormCard = styled.div`
  border-radius: 5px;
  border: 1px solid #bfbfbf;
  padding: 15px;
  margin-bottom: 30px;
  position: relative;
`;

const FormContainer = styled.div`
  width: 100%;
  margin-bottom: 200px;
  max-width: 600px;
`;

const RowHeader = styled.div`
  justify-content: space-between;
`;
const RowContent = styled(Row)`
  justify-content: space-between;
`;
function DirectorBriefInfo({ form, onEdit, onSubmit, isSubmitting }) {
  const directors = form.getFieldValue(["directors"]);

  return (
    <Wrapper>
      <ChatIcon />
      <PageText className="text-x-large text-center">
        Please review director's details below
      </PageText>
      <FormContainer>
        <Col className="w-100 text-white person-detail-info max-width-input">
          {directors?.map((director, index) => {
            return (
              <React.Fragment key={index}>
                <RowHeader className="text-bold text-large d-flex mb-2">
                  <span>Director #{index + 1}</span>{" "}
                  <EditIcon height={20} width={20} onClick={onEdit} />
                </RowHeader>
                <FormCard key={index} className="background-main">
                  <RowContent className="mb-2 d-flex" span={24}>
                    <div className="text-small">Full Name</div>
                    <div className="text-small">{director.name}</div>
                  </RowContent>
                  <RowContent className="mb-2 d-flex" span={24}>
                    <div className="text-small text-light">Nationality</div>
                    <div className="text-small">
                    {director.nationality === "MYS" ? "Malaysia" : director.nationality}
                  </div>
                  
                  </RowContent>
                  <RowContent className="mb-2 d-flex" span={24}>
                    <div className="text-small">NRIC</div>
                    <div className="text-small">{director.nric}</div>
                  </RowContent>
                  {director?.pep === "Yes" && director?.personInvolve?.toLowerCase()?.includes("myself") &&(
                    <>
                      <Divider plain className="text-white"></Divider>
                      <RowContent className="mb-2 d-flex" span={24}>
                        <div className="text-small bold">
                          <strong>PEP Status</strong>
                        </div>
                      </RowContent>
                      <RowContent className="mb-2 d-flex" span={24}>
                        <div className="text-small">
                          Role in organization/
                          <br />
                          party/association
                        </div>
                        <div className="text-small">{director?.pepDeclaration?.member?.role}</div>
                      </RowContent>
                      <RowContent className="mb-2 d-flex" span={24}>
                        <div className="text-small">
                          Organization/party/
                          <br />
                          association Name
                        </div>
                        <div className="text-small">{director?.pepDeclaration?.member?.organization}</div>
                      </RowContent>
                      <RowContent className="mb-2 d-flex" span={24}>
                        <div className="text-small">Position Held</div>
                        <div className="text-small">{director?.pepDeclaration?.member?.positionHeld}</div>
                      </RowContent>
                      <RowContent className="mb-2 d-flex" span={24}>
                        <div className="text-small">No of Year</div>
                        <div className="text-small">{director?.pepDeclaration?.member?.year}</div>
                      </RowContent>
                    </>
                  )}
                  
                  {director?.personInvolve?.toLowerCase()?.includes("family") && 
                  director?.pepDeclaration?.family?.map((dependent, dependentIndex) => (
                    <React.Fragment key={`${index}-${dependentIndex}`}>
                       
                          <Divider plain className="text-white"></Divider>
                          <RowContent className="mb-2 d-flex" span={24}>
                            <div className="text-small bold">
                              <strong>Family Member PEP Status</strong>
                            </div>
                          </RowContent>
                          <RowContent className="mb-2 d-flex" span={24}>
                            <div className="text-small">FullName</div>
                            <div className="text-small">
                              {dependent.name}
                            </div>
                          </RowContent>
                          <RowContent className="mb-2 d-flex" span={24}>
                            <div className="text-small">NRIC</div>
                            <div className="text-small">{dependent.nric}</div>
                          </RowContent>
                          <RowContent className="mb-2 d-flex" span={24}>
                            <div className="text-small">
                              Role in organization/
                              <br />
                              party/association
                            </div>
                            <div className="text-small">{dependent.role}</div>
                          </RowContent>
                          <RowContent className="mb-2 d-flex" span={24}>
                            <div className="text-small">
                              Organization/party/
                              <br />
                              association Name
                            </div>
                            <div className="text-small">
                              {dependent.organization}
                            </div>
                          </RowContent>
                          <RowContent className="mb-2 d-flex" span={24}>
                            <div className="text-small">Position Held</div>
                            <div className="text-small">
                              {dependent.positionHeld}
                            </div>
                          </RowContent>
                          <RowContent className="mb-2 d-flex" span={24}>
                            <div className="text-small">
                              Relationship with director
                            </div>
                            <div className="text-small">
                              {dependent.relationship}
                            </div>
                          </RowContent>                        
                    </React.Fragment>
                  ))}
                </FormCard>
              </React.Fragment>
            );
          })}

          <div
            className="center-items d-flex-c w-100"
            style={{ marginTop: "50px" }}
          >
            <PrimaryButton
              rootclass="full-width-button my-3 w-80"
              text={"Save & Close"}
              htmlType="submit"
              isLoading={isSubmitting}
              // onClick={onSubmit}
            />
          </div>
        </Col>
      </FormContainer>
    </Wrapper>
  );
}

export default DirectorBriefInfo;
