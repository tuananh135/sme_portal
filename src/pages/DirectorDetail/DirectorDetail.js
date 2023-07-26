import PrimaryButton from "common/components/Button/PrimaryButton";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import {
  Button,
  Form,
  Input,
  Radio,
  Checkbox,
  Image,
  Upload,
  message,
} from "antd";
import {
  constructNewFileName,
  toBase64,
  validateFileTypeAndSize,
} from "common/utils/fileUtils";
import { FILE_TYPE, KYC_STATUS, REGEX } from "common/constants/constants";
import { PlusCircleOutlined } from "@ant-design/icons";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { ReactComponent as InfoIcon } from "assets/images/icon-info.svg";
import { ReactComponent as RemoveIcon } from "assets/images/icon-remove.svg";
import PEPDescriptionModal from "./components/PEPDescriptionModal";
import UploadDocumentComponent from "./components/UploadDocumentComponent";
import { RegexValidator } from "common/utils/validators";
import DirectorAuthorisationModal from "./components/DirectorAuthorisationModal";
import { MaskedInput } from "antd-mask-input";
import { ReactComponent as ErrorIcon } from "assets/images/icon-error-small.svg";
import { NotificationDispatchContext } from "contexts/NotificationContext";
import { MEMBER_ERRORS } from "common/constants/membersCheckingError";
import { PersonService } from "services/B2CService/PersonService";
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";

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

const GroupHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
`;
const RemoveStyledIcon = styled(RemoveIcon)`
  height: 16px;
  width: 16px;
  position: absolute;
  top: -8px;
  right: 4px;
`;

function DirectorDetail({
  form,
  onSubmit,
  groupId,
  documentsUploadedPros,
  isDefaultComplete,
}) {
  const { updateNotification } = useContext(NotificationDispatchContext);
  const authUploadRef = useRef();
  const [showPEPDesModal, setShowPEPDesModal] = useState(false);
  const [showDirectorAuthModal, setShowDirectorAuthModal] = useState(false);
  const [changeAfterApproved, setChangeAfterApproved] = useState(false);
  const [documentComplete, setDocumentComplete] = useState(isDefaultComplete);
  const [documentsUploaded, setIsDocumentsUpload] = useState(
    documentsUploadedPros
  );
  const [isFormValid, setIsFormValid] = useState(true);
  const [currentEmployeeGroup, setEmployeeGroup] = useState({});
  const [directorList, setDirectorList] = useState([]);
  const [documents, setDocuments] = useState({
    ssm: {
      Data: "",
      type: "",
    },
    form9: {
      Data: "",
      type: "",
    },
    form24: {
      Data: "",
      type: "",
    },
    form49: {
      Data: "",
      type: "",
    },
    form13: {
      Data: "",
      type: "",
    },
    letter: {
      Data: "",
      type: "",
    },
  });

  useEffect(() => {
    Promise.all([searchCurrentEmployeeGroup()]);
  }, []);

  const searchCurrentEmployeeGroup = async () => {
    if (groupId) {
      var emp = await EmployeeGroupService.GetEmployeeGroupByID(groupId);
      if (emp?.status === 200) {
        console.log("emp.data", emp.data);
        setEmployeeGroup(emp.data);
      }
    }
  };

  const handleSubmit = () => {
    const directors = form.getFieldValue("directors");
    const updatedDirectors = directors.map((director) => ({
      ...director,
      nationality: "MYS",
    }));

    form.setFieldsValue({ directors: updatedDirectors });

    form
      .validateFields()
      .then((values) => {
        onSubmit(); // Call the onSubmit function to handle form submission
      })
      .catch((errorInfo) => {
        // Handle errors in the form
        console.log("Validation failed:", errorInfo);
      });
  };

  const validateDirector = async (index) => {
    try {
      await form.validateFields();
      return true; // validation passed
    } catch (error) {
      if (error.errorFields.length === 1) {
        if (error.errorFields[0].name[2] === "nationality") {
          return true; // validation passed
        }
      }
      return false; // validation failed
    }
  }

  const beforeUpload = (file) => {
    const validateResult = validateFileTypeAndSize(
      file,
      FILE_TYPE.DIRECTOR_DOCUMENT,
      3
    );
    if (validateResult.error) {
      updateNotification([
        {
          id: Math.random(),
          message: validateResult?.message,
          types: "error",
        },
      ]);
    }
    return validateResult.error ? Upload.LIST_IGNORE : false;
  };

  const refreshDocumentComplete = () => {
    if (documentsUploaded?.ssm?.Status) {
      setDocumentComplete(true);
    } else{
      setDocumentComplete(false);
    }
  };

  const getUploadProps = (type, index) => {
    return {
      name: `file_${type}`,
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text",
      },
      onChange: async (info) => {
        console.log("info", info, type);
        const base64File = await toBase64(info.file);
        const newData = {
          type: type,
          base64: base64File,
          fileExtension: info.file.type,
          fileName: constructNewFileName(
            info.file.name?.replaceAll(" ", ""),
            type
          ),
          employeeGroupId: groupId,
        };

        setIsDocumentsUpload((prevState) => {
          if (newData.type === "ssm" && newData.base64 !== undefined) {
            prevState.ssm = { Status: true }; // update ssm status to true
          }

          if (newData.type === "form9" && newData.base64 !== undefined) {
            prevState.form9 = { Status: true }; // update form9 status to true
          }

          if (newData.type === "form13" && newData.base64 !== undefined) {
            prevState.form13 = { Status: true }; // update form13 status to true
          }

          if (newData.type === "form24" && newData.base64 !== undefined) {
            prevState.form24 = { Status: true }; // update form24 status to true
          }

          if (newData.type === "form49" && newData.base64 !== undefined) {
            prevState.form49 = { Status: true }; // update form49 status to true
          }

          return prevState; // return the updated state object
        });

        refreshDocumentComplete();
        form.setFieldValue(["documents", index], newData);
        setDocuments((prev) => ({ ...prev, [type]: newData }));
        if (type === "letter") {
          setShowDirectorAuthModal(false);
        }
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
      },
      beforeUpload: beforeUpload,
      multiple: false,
      showUploadList: false,
    };
  };

  const openDirectorAuth = () => {
    setShowDirectorAuthModal(true);
  };

  const onUploadAuthDocument = () => {
    setShowDirectorAuthModal(false);
    authUploadRef.current.click();
  };

  const onDeleteDirector = async (index) => {
    const directors = form.getFieldValue("directors");
    var deleteDirector = directors[index];
    if (deleteDirector.id !== undefined) {
      const result = await PersonService.DeletePerson(deleteDirector.id);
      if (result) {
        setDirectorList((prev) => {
          return prev.filter((item) => item?.id !== deleteDirector.id);
        });
        setDirectorList(null);
        console.log(`Deleting director at index ${index}`);
      }
    }
  };

  return (
    <Wrapper>
      <ChatIcon pageName="DirectorDetails"/>
      <PageText className="text-x-large text-center">
      Please update the director's details here
      </PageText>
      <StepProgressTrigger className="mb-5"/>
      <FormContainer>
          <Form.List name="directors">
            {(fields, { add, remove }) => {
              const maxDirectors = 5;
              const handleAddDirector = async () => {
                if (fields.length < maxDirectors) {
                  const lastIndex = fields.length - 1;
                  const isValid = await validateDirector(lastIndex);
                  if (isValid) {
                    add();
                  }
                }
              };

              const isAddDirectorButtonDisabled = fields.length >= maxDirectors;

              return (
                <>
                  {fields?.map((field, index) => (
                    <FormCard key={index} className="background-main">
                      {index > 0 && (
                        <RemoveStyledIcon
                          className="cursor-pointer"
                          onClick={() => {
                            onDeleteDirector(index);
                            remove(index);
                          }}
                        />
                      )}
                      <p className="text-white">
                        Director's Details {index > 0 ? `#${index + 1}` : ""}
                      </p>

                      <Form.Item
                        style={{ display: "none" }}
                        name={[index, "id"]}
                      >
                        <Input />
                      </Form.Item>

                      <p className="text-white text-x-small">Director's Name</p>
                      <Form.Item
                        name={[index, "name"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: (
                              <div className="d-flex">
                                <ErrorIcon width={20}> </ErrorIcon>
                                <div>*fill in Name</div>
                              </div>
                            ),
                          },
                          {
                            message: (
                              <div key="error" className="d-flex">
                                <ErrorIcon width={20}></ErrorIcon>
                                <div>
                                  {MEMBER_ERRORS.NAME_LENGTH_VALIDATION.LONG}
                                </div>
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
                        <Input />
                      </Form.Item>

                      <p className="text-white text-x-small">
                        Director's Email
                      </p>
                      <Form.Item
                        name={[index, "email"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: (
                              <div className="d-flex">
                                <ErrorIcon width={20}> </ErrorIcon>
                                <div>*fill in Email"</div>
                              </div>
                            ),
                          },
                          {
                            message: (
                              <div className="d-flex">
                                <ErrorIcon width={20}> </ErrorIcon>
                                <div>The input is not valid Email!</div>
                              </div>
                            ),
                            validator: (_, value) =>
                              RegexValidator(_, value, REGEX.EMAIL),
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <p
                        style={{ display: "none" }}
                        className="text-white text-x-small"
                      >
                        Nationality
                      </p>
                      <Form.Item
                        style={{ display: "none" }}
                        name={[index, "nationality"]}
                        className="margin-0"
                        rules={[
                          {
                            required: true,
                            message: "*choose Nationality",
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Radio
                            className="text-white text-x-small red-radio"
                            value="MY"
                          >
                            Malaysian
                          </Radio>
                          <Radio
                            className="text-white text-x-small red-radio"
                            value="NonMalaysian"
                            disabled={true}
                          >
                            Non-Malaysian
                          </Radio>
                          <Form.Item shouldUpdate={true} className="margin-0">
                            {({ getFieldValue }) => {
                              return getFieldValue([
                                "directors",
                                index,
                                "Nationality",
                              ]) === "NonMalaysian" ? (
                                <p className="text-tooltip text-x-small margin-0">
                                  *application may take up to 3 days to process
                                </p>
                              ) : null;
                            }}
                          </Form.Item>
                        </Radio.Group>
                      </Form.Item>

                      <p className="text-white text-x-small">Director's NRIC</p>
                      <Form.Item
                        name={[index, "nric"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
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
                                <div>The input is not valid NRIC!</div>
                              </div>
                            ),
                            validator: (_, value) =>
                              RegexValidator(_, value, REGEX.NRIC),
                          },
                        ]}
                      >
                        <MaskedInput mask={"000000-00-0000"} />
                      </Form.Item>
                      <p className=" text-x-small text-white">
                        Does any of the ultimate natural person beneficial
                        owner(s), their immediate family members/close
                        associates hold, or previously held or is being
                        considered for prominent public position?
                        <InfoIcon
                          onClick={() => setShowPEPDesModal(true)}
                          className="ml-1 cursor-pointer"
                          style={{
                            height: "14px",
                            width: "14px",
                            position: "absolute",
                          }}
                        />
                      </p>
                      <Form.Item
                        name={[index, "pep"]}
                        className="margin-0"
                        rules={[
                          {
                            required: true,
                            message: (
                              <div className="d-flex">
                                <ErrorIcon width={20}> </ErrorIcon>
                                <div>*Choose PEP"</div>
                              </div>
                            ),
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Radio
                            className="text-white text-x-small red-radio"
                            value="Yes"
                          >
                            YES
                          </Radio>
                          <Radio
                            className="text-white text-x-small red-radio"
                            value="No"
                          >
                            NO
                          </Radio>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item shouldUpdate={true}>
                        {({ getFieldValue }) => {
                          return getFieldValue(["directors", index, "pep"]) ===
                            "Yes" ? (
                            <>
                              <p className=" text-x-small text-white">
                                Who is/are involve?
                              </p>
                              <Form.Item name={[index, "personInvolve"]}>
                                <Radio.Group>
                                  <Radio
                                    className="text-white text-x-small red-radio d-block mb-2"
                                    value="MySelf"
                                  >
                                    Myself
                                  </Radio>
                                  <Radio
                                    className="text-white text-x-small red-radio d-block mb-2"
                                    value="MySelfFamilyMemberOnly"
                                  >
                                    Myself and family member
                                  </Radio>
                                  <Radio
                                    className="text-white text-x-small red-radio d-block"
                                    value="FamilyMemberOnly"
                                  >
                                    Family Member only
                                  </Radio>
                                </Radio.Group>
                              </Form.Item>
                            </>
                          ) : null;
                        }}
                      </Form.Item>
                    </FormCard>
                  ))}
                  <div className="d-flex center-items mb-4">
                    <Button
                      onClick={handleAddDirector}
                      className="TuneAddDirectorButton"
                      disabled={isAddDirectorButtonDisabled}
                    >
                      {isAddDirectorButtonDisabled
                        ? "Maximum directors reached"
                        : "Add more directors"}
                      <PlusCircleOutlined color="white" />
                    </Button>
                  </div>
                </>
              );
            }}
          </Form.List>
          <Form.List name="documents">
            {(fields, { add, remove }) => {
              const documentItems = form.getFieldValue(["documents"]);
              const letterItemIndex = documentItems
                ?.map((item) => item.type)
                ?.indexOf("letter");
              return (
                <>
                  <FormCard className="background-main">
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: "20px" }}>
                    <ChatIcon pageName="BusinessDoc" width={50} />
                  </div>
                    <p className="text-white">Business Registration Document</p>
                    {fields
                      ?.filter((item, index) => index !== letterItemIndex)
                      .map((field, index) => {
                        const currentValue = form.getFieldValue([
                          "documents",
                          index,
                        ]);
                        return (
                          <Form.Item name={[index]} key={index}>
                            <UploadDocumentComponent
                              statusKYC={currentEmployeeGroup?.kycStatus}
                              changeAfterApproved={changeAfterApproved}
                              setChangeAfterApproved={setChangeAfterApproved}
                              componentProps={getUploadProps(
                                form.getFieldValue([
                                  "documents",
                                  index,
                                  "type",
                                ]),
                                index
                              )}
                              uploadData={currentValue}
                              remove={(e) => {
                                e.stopPropagation();
                                form.setFieldValue(["documents", index], {
                                  ...currentValue,
                                  base64: "",
                                  fileExtension: "",
                                  fileName: "",
                                });
                                setIsDocumentsUpload((prevState) => {
                                  prevState[
                                    form.getFieldValue([
                                      "documents",
                                      index,
                                      "type",
                                    ])
                                  ] = { Status: false };
                                  return prevState;
                                });
                                refreshDocumentComplete();
                              }}
                            />
                          </Form.Item>
                        );
                      })}
                  </FormCard>
                  <FormCard className="background-main">
                    <p className="text-white">Authorisation</p>
                    {fields
                      ?.filter((item, index) => index === letterItemIndex)
                      .map((field, index) => {
                        const currentValue = form.getFieldValue([
                          "documents",
                          letterItemIndex,
                        ]);
                        return (
                          <Form.Item name={[letterItemIndex]} key={index}>
                            <UploadDocumentComponent
                              statusKYC={currentEmployeeGroup?.kycStatus}
                              authorisationStatus={currentEmployeeGroup?.authorisationStatus}
                              hideIcon={true}
                              hideProcessBar={false}
                              changeAfterApproved={changeAfterApproved}
                              setChangeAfterApproved={setChangeAfterApproved}
                              componentProps={getUploadProps(
                                form.getFieldValue([
                                  "documents",
                                  letterItemIndex,
                                  "type",
                                ]),
                                letterItemIndex
                              )}
                              uploadData={currentValue}
                              remove={(e) => {
                                e.stopPropagation();
                                form.setFieldValue(
                                  ["documents", letterItemIndex],
                                  {
                                    ...currentValue,
                                    base64: "",
                                    fileExtension: "",
                                    fileName: "",
                                  }
                                );
                              }}
                              customAction={openDirectorAuth}
                              ref={authUploadRef}
                            />
                          </Form.Item>
                        );
                      })}
                  </FormCard>
                </>
              );
            }}
          </Form.List>
          <Form.Item name={"isAgreeVerifyByCTO"} valuePropName="checked">
            <Checkbox className="tune-confirm-checkbox">
              <span className="text-white text-x-small">
                I agree and understand that Tune Protect Ventures Sdn Bhd will
                verify my business / the Company via CTOS. I also aware CTOS
                will approach one of our directors to obtain his/her consent for
                business screening digitally.
              </span>
            </Checkbox>
          </Form.Item>
          <div className="w-100 text-center mt-5">
            <Form.Item shouldUpdate>
              {({ getFieldsValue }) => {
                const { isAgreeVerifyByCTO } = getFieldsValue();
                return (
                  <PrimaryButton
                    disabled={
                      !isAgreeVerifyByCTO || !documentComplete || !isFormValid
                    }
                    type="primary"
                    onClick={handleSubmit}
                    text="Save & Close"
                  />
                );
              }}
            </Form.Item>
          </div>
      </FormContainer>
      <PEPDescriptionModal
        show={showPEPDesModal}
        setShow={setShowPEPDesModal}
      />
      <DirectorAuthorisationModal
        show={showDirectorAuthModal}
        setShow={setShowDirectorAuthModal}
        getUploadProps={getUploadProps}
        directorInfo={form.getFieldValue("directors")}
      />
    </Wrapper>
  );
}

export default DirectorDetail;
