import { Button, Col, Image, Input, Row, Form, Divider, Select } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import chatImage from "assets/images/nina-small.png";
import SubmitQuestionModal from "common/components/Modal/SubmitQuestionModal";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import PrimaryButton from "common/components/Button/PrimaryButton";
import { RegexValidator } from "common/utils/validators";
import { REGEX } from "common/constants/constants";
import { MaskedInput } from "antd-mask-input";
import { ReactComponent as ErrorIcon } from "assets/images/icon-error-small.svg";
import { MEMBER_ERRORS } from "common/constants/membersCheckingError";
import { ReactComponent as RemoveIcon } from "assets/images/icon-remove.svg";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";

//#region Custom theme
const BodyContent = styled.div`
  color: white;
  text-align: center;
  font-size: larger;
  opacity: 0.9;
`;
const Flex = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`;

export default function PersonalPEP({ form, onBack }) {
  const personInvolve = form.getFieldValue("personInvolve");

  const changeRole = (memIndex, value) => {
    var currFamily =form.getFieldValue(["pepDeclaration","family", memIndex]) ;
    if(value === "Others"){
        currFamily.role= "Close Associate";
    }else{
      currFamily.role= "Family Member";
    }
    form.setFieldValue(["pepDeclaration", "family", memIndex, "role"], currFamily.role);
  }

  return (
    <BodyContent className="w-80">
      <ChatIcon />
      <Row style={{ justifyContent: "center", margin: "5vh 5vw 2vh 5vw" }}>
        Please complete Politically Exposed Person's Declaration below
      </Row>
      <StepProgressTrigger className="mb-5"/>

      {form.getFieldValue("personInvolve")?.toLowerCase()?.includes("myself") && <>
        <Form.Item name={"name"} >
          <Input className="mb-2" readOnly />
        </Form.Item>

        <Form.Item
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.pepDeclaration?.member?.nric !== currentValues.pepDeclaration?.member?.nric
        }
        >
          {({ getFieldValue }) => {
            const nationality = getFieldValue( "nationality");

            if (nationality !== 'MYS') {
              return (
                <Form.Item name={"passport"}>
                  <Input readOnly />
                </Form.Item>
              );
            }
            else {
              return (
              <Form.Item name={ "nric"}>
                <MaskedInput mask={"000000-00-0000"} readOnly />
              </Form.Item>
            );
            }           
          }}
        </Form.Item>
     
        <Form.Item
          name={["pepDeclaration", "member", "role"]}
          label="Role in the organization/party/association"
          initialValue={
            personInvolve === "MySelf"
              ? "Insured Member"
              : personInvolve === "MySelfFamilyMemberOnly"
              ? "Insured Member"
              : personInvolve === "FamilyMemberOnly"
              ? "Close associates"
              : "Insured Member"
          }
          rules={[
            {
              required: true
            },
          ]}
        >
          <Input  className="text-left" readOnly />
        </Form.Item>

        <Form.Item
          name={["pepDeclaration", "member", "organization"]}
          label="Organization/party/association Name"
          rules={[
            {
              required: true,
              message: <div className="d-flex">
              <ErrorIcon width={20}> </ErrorIcon>
              <div>
                *Organization is required
              </div>
            </div>
            },
            {
              max: 50,
              message: <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>
                  *Organization should be less than 50 characters
                </div>
              </div>,
            },
            {
              message: <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>
                  *The input is not valid Organization
                </div>
              </div>,
              validator: (_, value) =>
                RegexValidator(_, value, REGEX.ALPHABET),
            },
          ]}
        >
          <Input placeholder="Type here" />
        </Form.Item>

        <Form.Item
          name={["pepDeclaration", "member", "positionHeld"]}
          label="Position Held"
          rules={[
            {
              required: true,
              message: <div className="d-flex">
              <ErrorIcon width={20}> </ErrorIcon>
              <div>
                *Position is required
              </div>
            </div>,
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
            {
              message: <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>
                  *The input is not valid Position
                </div>
              </div>,
              validator: (_, value) =>
                RegexValidator(_, value, REGEX.ALPHABET),
            },
          ]}
        >
          <Input placeholder="Type here" />
        </Form.Item>

        <Form.Item
          name={["pepDeclaration", "member", "year"]}
          label="Number of years"
          rules={[
            {
              required: true,
              message: <div className="d-flex">
              <ErrorIcon width={20}> </ErrorIcon>
              <div>
                *Number of Years is required
              </div>
            </div>,
            },
            {
              max: 3,
              message: <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>
                  *Number of Years should be less than 3 characters
                </div>
              </div>,
            },
            {
              message: <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>
                  *The input is not valid Number of Years
                </div>
              </div>,
              validator: (_, value) => RegexValidator(_, value, REGEX.DIGIT_ONLY),
            },
          ]}
        >
          <Input placeholder="Number EX: 3" type="text" />
        </Form.Item></>}
      {form.getFieldValue("personInvolve")?.toLowerCase()?.includes("familymember") &&
        <Form.List shouldUpdate={true} name={["pepDeclaration", "family"]}>
          {(familyMembers, { add, remove }) => {
            return (
              <>
                {familyMembers.map((_, memIndex) => (
                  <div key={memIndex}>
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
                              <div>Fill in Full Name</div>
                            </div>
                          ),
                        },
                        {
                          message: (
                            <div key="error" className="d-flex">
                              <ErrorIcon width={20}></ErrorIcon>
                              <div>{MEMBER_ERRORS.NAME_LENGTH_VALIDATION.LONG}</div>
                            </div>
                          ),
                          validator: (_, value) =>
                            RegexValidator(_, value, REGEX.ALPHABET_MAX),
                        },
                        {
                          message: (
                            <div key="error" className="d-flex">
                              <ErrorIcon width={20}></ErrorIcon>
                              <div>{MEMBER_ERRORS.NAME_VALIDATION.LONG}</div>
                            </div>
                          ),
                          validator: (_, value) =>
                            RegexValidator(_, value, REGEX.ALPHABET_NAME),
                        },
                      ]}
                    >
                      <Input className="mb-2" placeholder="Type Full Name (Family Member)" />
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
                          validator: (_, value) => RegexValidator(_, value, REGEX.NRIC),
                        },
                      ]}
                    >
                      <MaskedInput mask={"000000-00-0000"} />
                    </Form.Item>
                
                    <Form.Item
                      name={[memIndex, "role"]}
                      label="Role in the organization/party/association"
                      initialValue={
                          personInvolve?.toLowerCase() === "myselffamilymemberonly"
                          ? "Family member"
                         : personInvolve?.toLowerCase() === "familymemberonly"
                          ? "Family member"
                          : "Undefined"
                      }
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                       <Input  className="text-left" readOnly />
                    </Form.Item>


                    <Form.Item
                      name={[memIndex, "organization"]}
                      label="Organization/party/association Name"
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                        {
                          max: 50,
                          message: <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>
                              *Organization should be less than 50 characters
                            </div>
                          </div>,
                        },
                        {
                          message: <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>
                              *The input is not valid Organization
                            </div>
                          </div>,
                          validator: (_, value) =>
                            RegexValidator(_, value, REGEX.ALPHABET),
                        },
                      ]}
                    >
                      <Input placeholder="Type here" />
                    </Form.Item>

                    <Form.Item
                      name={[memIndex, "positionHeld"]}
                      label="Position Held"
                      rules={[
                        {
                          required: true,
                          message: "",
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
                        {
                          message: <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>
                              *The input is not valid Position
                            </div>
                          </div>,
                          validator: (_, value) =>
                            RegexValidator(_, value, REGEX.ALPHABET),
                        },
                      ]}
                    >
                      <Input placeholder="Type here" />
                    </Form.Item>
                    <Form.Item
                      name={[memIndex, "relationship"]}
                      label="Relationship"
                      rules={[
                        {
                          required: true,
                          message: (
                            <div className="d-flex">
                              <ErrorIcon width={20}> </ErrorIcon>
                              <div>*fill in Relationship</div>
                            </div>
                          ),
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
                  className="text-white text-underline text-small mt-4"
                >
                  Add Family Member
                  <PlusOutlined style={{ fontSize: "8px" }} />
                </div>
              </>
            );
          }}
        </Form.List>}
      <Row style={{ margin: "3vh 0vw 3vh 0vw", justifyContent: "center" }}>
        <PrimaryButton
          text={"SAVE & CLOSE"}
          htmlType="submit"
          rootclass="half-width-button"
        />
      </Row>
      {/* <div className="text-white text-start" id="back" onClick={onBack}>
        BACK
      </div> */}
    </BodyContent>
  );
}
