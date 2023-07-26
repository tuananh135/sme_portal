import { Button, Col, Image, Input, Row, Form, Divider, Select } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import SubmitQuestionModal from "common/components/Modal/SubmitQuestionModal";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ReactComponent as RemoveIcon } from "assets/images/icon-remove.svg";
import { RegexValidator } from "common/utils/validators";
import { REGEX } from "common/constants/constants";
import { MaskedInput } from "antd-mask-input";
import { ReactComponent as ErrorIcon } from "assets/images/icon-error-small.svg";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";

//#region Custom theme
const BodyContent = styled.div`
max-width: 600px;
  color: white;
  text-align: center;
  font-size: larger;
  opacity: 0.9;
`;
const FormCard = styled.div`
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 30px;
  position: relative;
`;

const Flex = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`;

export default function PoliticallyExpose({ form, onNext }) {
  const [showQuestion, setShowQuestion] = useState(false);
  const directors = form.getFieldValue(["directors"]);
  const [currentDirector, setCurrentDirector] = useState(
    directors?.findIndex((d) => d.pep?.toLowerCase() === "yes")
  );

    const changeRole = (memIndex, value) => {
      var currFamily =form.getFieldValue(["directors", currentDirector,"pepDeclaration","family", memIndex]) ;
      if(value === "Others"){
          currFamily.role= "Close Associate";
      }else{
        currFamily.role= "Family Member";
      }
      form.setFieldValue(["directors", currentDirector, "pepDeclaration", "family", memIndex, "role"], currFamily.role);
    }

  const onNextButton = (currentIndex) => {
    if (currentIndex < directors?.length - 1) {
      if (directors[currentIndex + 1]?.pep === "Yes") {
        setCurrentDirector((prev) => prev + 1);
        return;
      } else {
        onNextButton(currentIndex + 1);
      }
    } else {
      onNext();
      return;
    }
  };   

  return (
    <BodyContent>
      <ChatIcon pageName="PEP"/>
      <Row style={{ justifyContent: "center", margin: "5vh 5vw 0vh 5vw" }}>
        Please complete Politically Exposed Person's Declaration below
      </Row>
      <StepProgressTrigger className="mb-5"/>
      <Form.List name="directors">
        {(fields) => {
          return (
            <>
              {fields?.map((field, index) => (
                <FormCard
                  key={index}
                  style={{
                    display: index === currentDirector ? "block" : "none",
                  }}
                >
                  {directors[index]?.personInvolve?.toLowerCase()?.includes("myself") && <>
                  <Form.Item className="mb-2" name={[index, "pepDeclaration", "member", "name"]}
                  initialValue={directors[currentDirector]?.name}>
                    <Input
                    value={directors[currentDirector]?.name} readOnly />
                  </Form.Item>
                  <Form.Item name={[index, "pepDeclaration", "member", "nric"]}
                  initialValue={directors[currentDirector]?.nric}>
                    <Input 
                    value={directors[currentDirector]?.nric}
                    readOnly />
                  </Form.Item>

                  <p className="text-white text-x-small text-left">
                    Role in the organization/party/association
                  </p>
                  <Form.Item
                    name={[index, "pepDeclaration", "member", "role"]}
                    initialValue={
                      directors[index]?.personInvolve === "MySelf"
                        ? "Beneficial owner"
                        : directors[index]?.personInvolve === "MySelfFamilyMemberOnly"
                        ? "Beneficial owner"
                        : directors[index]?.personInvolve === "FamilyMemberOnly"
                        ? "Close associates"
                        : "Beneficial owner"
                    }
                    rules={[
                      {
                        required: true
                      },
                    ]}
                  >
                    <Input  className="text-left" readOnly />
                  </Form.Item>

                  <p className="text-white text-x-small text-left">
                    Name of Political Party/ Organisation/ Association
                  </p>
                  <Form.Item
                    name={[index, "pepDeclaration", "member", "organization"]}
                    rules={[
                      {
                        required: true,
                        message: (
                          <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>
                              *fill in Name of Political Party/ Organisation/ Association
                            </div>
                          </div>
                        ),
                      },
                      {
                        message: <div className="d-flex">
                          <ErrorIcon width={20}> </ErrorIcon>
                          <div>
                            The input is not valid Name of Political Party/ Organisation/ Association
                          </div>
                        </div>,
                        validator: (_, value) =>
                          RegexValidator(_, value, REGEX.ALPHABET),
                      },
                      {
                        max: 50,
                        message:
                          <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>
                              *Name of Political Party/ Organisation/ Association should be less than 50 characters
                            </div>
                          </div>,
                      },
                    ]}
                  >
                    <Input placeholder="Type here" />
                  </Form.Item>

                  <p className="text-white text-x-small text-left">
                    Position Held
                  </p>
                  <Form.Item
                    name={[index, "pepDeclaration", "member", "positionHeld"]}
                    rules={[
                      {
                        required: true,
                        message:
                          <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>*fill in Position</div>
                          </div>
                        ,
                      },
                      {
                        message: <div className="d-flex">
                          <ErrorIcon width={20}> </ErrorIcon>
                          <div>
                            The input is not valid Position
                          </div>
                        </div>,
                        validator: (_, value) =>
                          RegexValidator(_, value, REGEX.ALPHABET),
                      },
                      {
                        max: 50,
                        message: <div className="d-flex">
                          <ErrorIcon width={20}> </ErrorIcon>
                          <div>
                            *Position should be less than 50 characters
                          </div>
                        </div>,
                      },
                    ]}
                  >
                    <Input placeholder="Type here" />
                  </Form.Item>

                  <p className="text-white text-x-small text-left">
                    Number of years
                  </p>
                  <Form.Item
                    name={[index, "pepDeclaration", "member", "year"]}
                    rules={[
                      {
                        required: true,
                        message: (
                          <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>*fill in Position Years</div>
                          </div>
                        ),
                      },
                      {
                        message: <div className="d-flex">
                          <ErrorIcon width={20}> </ErrorIcon>
                          <div>
                            The input is not valid Number of year
                          </div>
                        </div>,
                        validator: (_, value) =>
                          RegexValidator(_, value, REGEX.DIGIT_ONLY),
                      },
                      {
                        max: 3,
                        message: <div className="d-flex">
                          <ErrorIcon width={20}> </ErrorIcon>
                          <div>
                            *Number of year should be less than 3 characters
                          </div>
                        </div>,
                      },
                    ]}
                  >
                    <Input placeholder="Number EX: 3" type="number" />
                    </Form.Item></>}
                  {directors[index]?.personInvolve?.toLowerCase()?.includes("family") && (
                    <Form.List name={[index, "pepDeclaration", "family"]}>
                      {(members, { add, remove }) => {
                        return (
                          <>
                            {members.map((member, memIndex) => (
                              <div key={member.key}>
                                <Flex>
                                  <div style={{ width: "calc(100% - 25px)" }}>
                                    <Divider
                                      style={{ color: "#bfbfbf", borderColor: "#bfbfbf" }}
                                      plain
                                      orientation="left"
                                    >
                                      Family Member
                                    </Divider>
                                  </div>
                                  <RemoveIcon onClick={() => remove(memIndex)} style={{ margin: "auto 0" }} />
                                </Flex>

                                <Form.Item
                                  name={[memIndex, "name"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: (
                                        <div className="d-flex">
                                          <ErrorIcon width={20}> </ErrorIcon>
                                          <div>*fill in Name</div>
                                        </div>
                                      ),
                                    },
                                    {
                                      max: 50,
                                      message:
                                        <div className="d-flex">
                                          <ErrorIcon width={20}> </ErrorIcon>
                                          <div>
                                            *Name should be less than 50 characters
                                          </div>
                                        </div>,
                                    },
                                    {
                                      message: <div className="d-flex">
                                        <ErrorIcon width={20}> </ErrorIcon>
                                        <div>
                                          The input is not valid Name
                                        </div>
                                      </div>,
                                      validator: (_, value) =>
                                        RegexValidator(
                                          _,
                                          value,
                                          REGEX.ALPHABET
                                        ),
                                    },
                                  ]}
                                >
                                  <Input placeholder="Type Full Name (Family Member)" />
                                </Form.Item>
                                <Form.Item
                                  name={[memIndex, "nric"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: (
                                        <div className="d-flex">
                                          <ErrorIcon width={20}> </ErrorIcon>
                                          <div>*fill in NRIC</div>
                                        </div>
                                      ),
                                    },
                                    {
                                      message: (
                                        <div className="d-flex">
                                          <ErrorIcon width={20}> </ErrorIcon>
                                          <div>The input is not valid NRIC</div>
                                        </div>
                                      ),
                                      validator: (_, value) =>
                                        RegexValidator(_, value, REGEX.NRIC),
                                    },
                                  ]}
                                >
                                  <MaskedInput mask={"000000-00-0000"} />
                                </Form.Item>

                                <p className="text-white text-x-small text-left">
                                  Role in the organization/party/association
                                </p>
                                <Form.Item
                                  name={[memIndex, "role"]}
                                  initialValue={
                                     directors[index]?.personInvolve?.toLowerCase() === "myselffamilymemberonly"
                                      ? "Family member"
                                      : directors[index]?.personInvolve?.toLowerCase() === "familymemberonly"
                                      ? "Family member"
                                      : "Undefined"
                                  }
                                  rules={[
                                    {
                                      required: true
                                    },
                                  ]}
                                >
                                  <Input  className="text-left"
                                  value={form.getFieldValue(["directors", currentDirector,"pepDeclaration","family", memIndex, "role"])} readOnly />
                              </Form.Item>

                                <p className="text-white text-x-small text-left">
                                  Organization/party/association Name
                                </p>
                                <Form.Item
                                  name={[memIndex, "organization"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "",
                                    },
                                    {
                                      max: 50,
                                      message:
                                        "*Organization should be less than 50 characters",
                                    },
                                    {
                                      message:
                                        "*The input is not valid Organization",
                                      validator: (_, value) =>
                                        RegexValidator(
                                          _,
                                          value,
                                          REGEX.ALPHABET_DIGIT_SPECIAL
                                        ),
                                    },
                                  ]}
                                >
                                  <Input placeholder="Type here" />
                                </Form.Item>

                                <p className="text-white text-x-small text-left">
                                  Position Held
                                </p>
                                <Form.Item
                                  name={[memIndex, "positionHeld"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "",
                                    },
                                    {
                                      max: 50,
                                      message:
                                        "*Position should be less than 50 characters",
                                    },
                                    {
                                      message:
                                        "*The input is not valid Position",
                                      validator: (_, value) =>
                                        RegexValidator(
                                          _,
                                          value,
                                          REGEX.ALPHABET_DIGIT_SPECIAL
                                        ),
                                    },
                                  ]}
                                >
                                  <Input placeholder="Type here" />
                                </Form.Item>

                                <p className="text-white text-x-small text-left">
                                  Relationship With Director
                                </p>
                                <Form.Item
                                  name={[memIndex, "relationship"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "",
                                    },
                                  ]}
                                >
                                  <Select
                                    className="text-left"
                                    placeholder="Select"
                                    options={[
                                      {
                                        value: "Spouse",
                                        label: "Spouse",
                                      },
                                      {
                                        value: "Child",
                                        label: "Child/ Children",
                                      },
                                      {
                                        value: "Others",
                                        label: "Others",
                                      },
                                    ]}
                                    onChange={(value) => {
                                        changeRole(memIndex, value);
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            ))}
                            <div
                              onClick={() => add()}
                              className="text-white text-underline text-small"
                            >
                              Add Family Member
                              <PlusOutlined style={{ fontSize: "8px" }} />
                            </div>
                          </>
                        );
                      }}
                    </Form.List>
                  )}
                </FormCard>
              ))}
            </>
          );
        }}
      </Form.List>
      <Row style={{ margin: "3vh 0vw 3vh 0vw", justifyContent: "center" }}>
        <Button
          style={{
            backgroundColor: "#ec5a54",
            color: "white",
            minHeight: "40px",
            height: "auto",
            borderRadius: "5px",
            border: "0px",
            whiteSpace: "normal",
          }}
          className="half-width-button"
          type="primary"
          onClick={() => onNextButton(currentDirector)}
        >
          Save & Close
        </Button>
      </Row>

      <SubmitQuestionModal
        show={showQuestion}
        setShow={setShowQuestion}
      ></SubmitQuestionModal>
    </BodyContent>
  );
}
