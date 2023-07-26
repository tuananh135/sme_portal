import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Radio,
  notification,
  message,
  Tooltip,
} from "antd";
import { ReactComponent as InfoIcon } from "assets/images/icon-info.svg";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { useNavigate, useParams } from "react-router-dom";
import { PAGE_LINK } from "common/constants/pagelinks";
import { BusinessService } from "services/B2CService/BusinessDetailService";
import { AuthContext } from "contexts/AuthContext";
import {
  EmpGroupDispatchContext,
  EmpGroupStateContext,
} from "contexts/EmpGroupContext";
import {
  COUNTRY_CATEGORY,
  FRIENDLY_MESSAGE,
  REGEX,
} from "common/constants/constants";
import moment, { now } from "moment";
import { DateOfBirthValidator, RegexValidator } from "common/utils/validators";
import usePostalCode from "hooks/_usePostalCode";
import { NotificationDispatchContext } from "contexts/NotificationContext";
import { MaskedInput } from "antd-mask-input";
import { ReactComponent as ErrorIcon } from "assets/images/icon-error-small.svg";
import { CategoryService } from "services/B2CService/CategoryService";
import { BudgetService } from "services/B2CService/BudgetService";
import { CategoryStateContext } from "contexts/CategoryContext";
import PrimaryButton from "common/components/Button/PrimaryButton";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";

//#region Custom theme
const BodyContent = styled.div`
  color: white;
  text-align: center;
  font-size: larger;
  opacity: 0.9;
`;

const CheckboxCustom = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: green;
    border-color: green;
  }
  text-align: left;
`;

const GroupHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DatePickerCustom = styled(DatePicker)`
  padding: 0px 5px !important;
  input {
    font-size: 14px !important;
    padding: 10px !important;
  }
`;
//#endregion

export default function BusinessDetail({}) {
  const { countryList, industryList } = useContext(CategoryStateContext);
  const [showButton, setShowButton] = useState(false);
  const [confirmTruth, setConfirmTruth] = useState(false);
  const [confirmInEmail, setConfirmInEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rankData, setRankData] = useState([]);
  const [isInvalidPostalCode, setInvalidPostalCode] = useState(false);
  const [isInvalidPostalCodeAdmin, setInvalidPostalCodeAdmin] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentUser } = React.useContext(AuthContext);
  const { empGroupData, empGroupID } = React.useContext(EmpGroupStateContext);
  const { addressDebounceFn, address } = usePostalCode();
  const { updateNotification } = useContext(NotificationDispatchContext);
  const { updateEmpGroupID } = useContext(EmpGroupDispatchContext);

  const handleFormKeyDown = (event) => {
    if (event.key === "Enter" && !confirmTruth && !confirmInEmail) {
      event.preventDefault();
    }
  };

  const nextStep = (id) => {
    id
      ? navigate(PAGE_LINK.IDENTITY_VERIFICATION.NAME + `/${id}`)
      : navigate(PAGE_LINK.IDENTITY_VERIFICATION.NAME);
  };
  
  const onClickNext = async (value) => {
    setIsSubmitting(true);
    try {
      let type = "";
      if (localStorage.getItem("budgetOffer.currentRankData")) {
        type = JSON.parse(
          localStorage.getItem("budgetOffer.currentRankData")
        )?.type;
      }
      let effectiveDate = "";
      if (localStorage.getItem("effectiveDate.dateString")) {
        effectiveDate = localStorage.getItem("effectiveDate.dateString") ?? new Date().toISOString();
      }
      if (id) value["id"] = id;
      value["hrEmail"] = currentUser?.profile?.email;
      value["Type"] = "ADMIN";
      value["Combination"] = rankData?.map((item, index) => ({
        combiNo: item.combiNo,
        rank: index + 1,
        type: type,
      }));
      value["SameAsHome"] = "";
      value["yearOfEstablish"] = value["yearOfEstablish"].format("YYYY");
      value["address2"] = value.address2 || "";
      value["address3"] = value.address3 || "";
      value["businessAddress2"] = value.businessAddress2 || "";
      value["businessAddress3"] = value.businessAddress3 || "";
      value["nationality"] = "MYS";
      value["commencementDate"] = effectiveDate;
      value["affiliateCode"] = currentUser?.profile?.affiliate_code;

      const industryRisk = industryList?.find(
        (i) => i.industry_Cd === value["businessIndustry"]
      )?.remarks;
      if (industryRisk === "Upfront Reject") {
        updateNotification([
          {
            id: Math.random(),
            message: FRIENDLY_MESSAGE.REJECT_BY_GENERAL_BLOCK,
            types: "error",
          },
        ]);
      } else {
        var result = await BusinessService.PostBusinessDetail(value);
        if (result?.data?.code === 200) {
          updateEmpGroupID(result?.data?.data[0]?.id);

          // if user click normally do not redirect KYC reload success
          localStorage.setItem("businessDetail.redirectKYCSuccessPage", false);

          // save quote
          var requestData = {
            suggestionData: value["Combination"],
            coverType: localStorage.getItem("coverType.type"),
            budgetString: localStorage.getItem(
              "budgetPerEmployee.budgetString"
            ),
            numberOfEmpRef: localStorage.getItem("welcome.numberOfEmpRef"),
            budgetStartDate: localStorage.getItem("effectiveDate.dateString"),
            overrideExist: true,
            userId: currentUser.profile.id,
          };
          var resultSaveQuote = await BudgetService.SaveQuote(requestData);
          if (resultSaveQuote?.status === 200 && resultSaveQuote?.data?.data)
            nextStep(result?.data?.data[0]?.id);
          else {
            notification.error({
              message: resultSaveQuote?.data?.message || "Can not save data. Please try again!",
              description: "Error",
            });
          }
        } else {
          updateNotification([
            {
              id: Math.random(),
              message: (
                <div
                  dangerouslySetInnerHTML={{ __html: result?.data?.message }}
                ></div>
              ),
              types: "error",
            },
          ]);
        }
      }
    } catch (error) {
      updateNotification([
        {
          id: Math.random(),
          message: "Error during execution!",
          types: "error",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNricChange = (event) => {
    const formattedNric = event.target.value.replace(/-/g, "");

    if (formattedNric.length === 12) {
      const year = formattedNric.substr(0, 2);
      const month = formattedNric.substr(2, 2);
      const day = formattedNric.substr(4, 2);

      const fullYear = parseInt(year, 10) < 50 ? `20${year}` : `19${year}`;
      const dob = `${day}/${month}/${fullYear}`;

      form.setFieldValue("dateOfBirth", dob);
    }
  };

  const onChangePostalCode = (address) => {
    form.setFieldValue("city", address?.City || "");
    form.setFieldValue("state", address?.State || "");
    form.setFieldValue("country", address?.Country);

    if (address?.City === undefined && address?.State === undefined) {
      setInvalidPostalCode(true);
    } else {
      setInvalidPostalCode(false);
    }
    form.validateFields("postalCode");
  };

  const onChangePostalCodeAdmin = (address) => {
    form.setFieldValue("cityAdmin", address?.City || "");
    form.setFieldValue("stateAdmin", address?.State || "");
    form.setFieldValue("countryAdmin", address?.Country);

    if (address?.City === undefined && address?.State === undefined) {
      setInvalidPostalCodeAdmin(true);
    } else {
      setInvalidPostalCodeAdmin(false);
    }
    form.validateFields("postalCode");
  };

  const getCountryByCountryName = async (countryName) => {
    const result = await CategoryService.GetCountryByCountryName(countryName);
  };

  const detectExistEmployeeGroup = async () => {
    if (localStorage.getItem("budgetOffer.nextPage") === "true") {
      localStorage.removeItem("budgetOffer.nextPage");
    }
    if (id) return;
    if (currentUser?.profile?.id) {
      var employeeGroup = await BusinessService.SearchEmployeeGroupNotFinish(
        currentUser.profile.id
      );
      console.log("employeeGroup", employeeGroup);
      if (employeeGroup?.data?.code === 200 && employeeGroup?.data?.data?.id) {
        // hard reset
        window.location.href = window.location.href.replace(
          PAGE_LINK.BUSINESS_DETAIL.NAME,
          `${PAGE_LINK.BUSINESS_DETAIL.NAME}/${employeeGroup.data.data.id}`
        );
      }
    }
  };

  useEffect(() => {
    Promise.all([detectExistEmployeeGroup()]);
    setRankData(
      JSON.parse(localStorage.getItem("budgetOffer.currentRankData"))?.data
    );
    getCountryByCountryName();
  }, []);

  useEffect(() => {
    setShowButton(confirmTruth && confirmInEmail);
  }, [confirmTruth, confirmInEmail]);

  useEffect(() => {
    form.validateFields(["postalCode"]);
  }, [isInvalidPostalCode]);

  useEffect(() => {
    form.validateFields(["postalCodeAdmin"]);
  }, [isInvalidPostalCodeAdmin]);

  return (
    <BodyContent className="d-flex center-items d-flex-c">
      <ChatIcon pageName="businessDetails" width={50} />
      <Row style={{ justifyContent: "center", marginTop: 20 }}>
      Tell us about your business!
      </Row>
      <StepProgressTrigger/>
      <Form
        name="basic"
        size="small"
        form={form}
        initialValues={empGroupData ?? { nationality: "MYS" }}
        onFinish={onClickNext}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
        id="save-quote-form"
        autoComplete="off"
        className="center-items d-flex-c text-white business-detail-form"
        onKeyDown={handleFormKeyDown}
      >
        <Card
          className="max-width-input"
          style={{
            margin: "2vh 5vw 0vh 5vw",
            backgroundColor: "#45474e",
            color: "white",
            border: "solid 1px #585858",
            borderRadius: "10px",
          }}
        >
          <Row style={{ justifyContent: "center", marginBottom: "2vh" }}>
            <strong>Business Details</strong>
          </Row>

          <Row gutter={10} justify="space-between">
            <Col xs={24} lg={12}>
              <Form.Item
                name={"businessName"}
                label="Business Name"
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*fill in Business Name</div>
                      </div>
                    ),
                  },
                  {
                    max: 50,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>
                          *Business name should be less than 50 characters
                        </div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*The input is not valid Business name</div>
                      </div>
                    ),
                    validator: (_, value) =>
                      RegexValidator(_, value, REGEX.BUSSINESS_NAME),
                  },
                ]}
              >
                <Input placeholder="Key in your business name"></Input>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name={"businessRegistrationNumber"}
                label="Business Registration Number"
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*fill in Business Registration Number</div>
                      </div>
                    ),
                  },
                  {
                    max: 50,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>
                          *Business Registration Number should be less than 50
                          characters
                        </div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>
                          *The input is not valid Business Registration Number
                        </div>
                      </div>
                    ),
                    validator: (_, value) =>
                      RegexValidator(_, value, REGEX.ALPHABET_DIGIT_HYPHEN),
                  },
                ]}
              >
                <Input placeholder="123456-A"></Input>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name={"businessIndustry"}
                label={
                  <span>
                    Business Industry{' '}
                    <Tooltip placement="topLeft" title={'eCommerce retailer and online reseller are considered as IT related.'}>
                    <InfoIcon height={15} width={15} />
              </Tooltip>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*choose Business Industry</div>
                      </div>
                    ),
                  },
                ]}
              >
                <Select
                  style={{ width: "100%", textAlign: "left" }}
                  options={industryList?.map((item) => ({
                    label: item.industry_Nm,
                    value: item.industry_Cd,
                  }))}
                  placeholder="Choose Business Industry"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name={"yearOfEstablish"}
                label="Year of Establishment"
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*choose Year of Establishment</div>
                      </div>
                    ),
                  },
                ]}
              >
                <DatePickerCustom
                  size="large"
                  picker="year"
                  className="text-gray"
                  disabledDate={(d) => !d || d.isAfter(moment(Date.now()))}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"businessAddress1"}
                label="Business Address"
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*fill in Business Address</div>
                      </div>
                    ),
                  },
                  {
                    max: 50,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*Address should be less than 50 characters</div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*The input is not valid Address</div>
                      </div>
                    ),
                    validator: (_, value) =>
                      RegexValidator(_, value, REGEX.ALPHABET_DIGIT_SPECIAL),
                  },
                ]}
              >
                <Input placeholder="Address line 1" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"businessAddress2"}
                rules={[
                  {
                    max: 50,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*Address should be less than 50 characters</div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*The input is not valid Address</div>
                      </div>
                    ),
                    validator: (_, value) =>
                      RegexValidator(_, value, REGEX.ALPHABET_DIGIT_SPECIAL),
                  },
                ]}
              >
                <Input placeholder="Address line 2" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"businessAddress3"}
                rules={[
                  {
                    max: 50,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*Address should be less than 50 characters</div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*The input is not valid Address</div>
                      </div>
                    ),
                    validator: (_, value) =>
                      RegexValidator(_, value, REGEX.ALPHABET_DIGIT_SPECIAL),
                  },
                ]}
              >
                <Input placeholder="Address line 3" />
              </Form.Item>
            </Col>

            <Col xs={12} lg={12}>
              <Form.Item
                name={"postalCode"}
                label="Postal Code"
                rules={[
                  {
                    required: true,
                    pattern: /^[0-9]{5}$/,
                    message: (
                      <div className="d-flex mb-2">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>
                          *fill in Postal Code <br />
                          up to 5 digits
                        </div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*The input is not valid Postal code</div>
                      </div>
                    ),
                    validator: (_, value) =>
                      RegexValidator(_, value, REGEX.DIGIT_ONLY),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*Postal Code does not exist</div>
                      </div>
                    ),
                    validator: (_, value) => {
                      if (isInvalidPostalCode) {
                        return Promise.reject();
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  placeholder="00000"
                  onBlur={(e) => {
                    addressDebounceFn(e?.target?.value, onChangePostalCode);
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={12} lg={12}>
              <Form.Item
                name={"city"}
                label="City"
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*fill in City</div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*The input is not valid City</div>
                      </div>
                    ),
                    validator: (_, value) =>
                      RegexValidator(
                        _,
                        value.replaceAll(" ", ""),
                        REGEX.ALPHABET
                      ),
                  },
                ]}
              >
                <Input placeholder="Type city" />
              </Form.Item>
            </Col>

            <Col xs={12} lg={12}>
              <Form.Item
                name={"state"}
                label="State"
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*fill in State</div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*The input is not valid State</div>
                      </div>
                    ),
                    validator: (_, value) =>
                      RegexValidator(
                        _,
                        value.replaceAll(" ", ""),
                        REGEX.ALPHABET
                      ),
                  },
                ]}
              >
                <Input placeholder="Type state" />
              </Form.Item>
            </Col>

            <Col xs={12} lg={12}>
              <Form.Item
                name={"country"}
                label="Country"
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*fill in Country</div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*The input is not valid Country</div>
                      </div>
                    ),
                    validator: (_, value) =>
                      RegexValidator(
                        _,
                        value.replaceAll(" ", ""),
                        REGEX.ALPHABET
                      ),
                  },
                ]}
                readOnly={true}
              >
                <Input placeholder="Type country" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          className="max-width-input"
          style={{
            margin: "2vh 5vw 2vh 5vw",
            backgroundColor: "#45474e",
            color: "white",
            border: "solid 1px #585858",
            borderRadius: "10px",
            width: "-webkit-fill-available",
          }}
        >
        <ChatIcon pageName="PersonInCharge" width={50} />
          <Row style={{ justifyContent: "center", marginBottom: "2vh", marginTop: "2vh" }}>
            <strong>Person In Charge (Authoriser)</strong>
          </Row>

          <Col xs={24}>
            <Form.Item
              name={"personInCharge"}
              label="Person in Charge (full name)"
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
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*Name should be less than 50 characters</div>
                    </div>
                  ),
                },
                {
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>The input is not valid Name</div>
                    </div>
                  ),
                  validator: (_, value) =>
                    RegexValidator(_, value, REGEX.ALPHABET_NAME),
                },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name={"citizen"}
              initialValue={"Malaysia"}
              label="Nationality"
              className="text-left red-radio"
              rules={[
                {
                  required: true,
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*Choose Nationality</div>
                    </div>
                  ),
                },
                {
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>
                        Sorry we could only accept Malaysians as the person in
                        charge (Authoriser)
                      </div>
                    </div>
                  ),
                  validator: (_, value) => {
                    if (value === "NonMYS") {
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Radio.Group>
                <Radio className="text-white text-small" value="Malaysia">
                  Malaysian
                </Radio>
                <Radio className="text-white text-small" value="NonMYS">
                  Non-Malaysian
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name={"nric"}
              label="NRIC"
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
              <MaskedInput mask={"000000-00-0000"} onBlur={handleNricChange} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name={"dateOfBirth"} label="Date of Birth">
              <Input type="text" readOnly />
            </Form.Item>
          </Col>

          <Form.Item
            name={"emailAddress"}
            label="Email"
            rules={[
              {
                required: true,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*fill in Email</div>
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
                validator: (_, value) => RegexValidator(_, value, REGEX.EMAIL),
              },
            ]}
          >
            <Input placeholder="email@website.com"></Input>
          </Form.Item>
          <Form.Item
            name={"designation"}
            label="Job Title"
            rules={[
              {
                required: true,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*fill in Job Title</div>
                  </div>
                ),
              },
              {
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>The input is not valid Designation!</div>
                  </div>
                ),
                validator: (_, value) =>
                  RegexValidator(_, value, REGEX.ALPHABET),
              },
            ]}
          >
            <Input placeholder="Designation"></Input>
          </Form.Item>
          <Form.Item
            name={"mobileNumber"}
            label="Mobile Number"
            rules={[
              {
                required: true,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*fill in Mobile Number</div>
                  </div>
                ),
              },
              {
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>The input is not valid Phone Number!</div>
                  </div>
                ),
                validator: (_, value) => {
                  if (value.length < 8 || value.length > 10) {
                    return Promise.reject();
                  }
                  return RegexValidator(_, value, REGEX.PHONE_NUMBER);
                },
              },
            ]}
          >
            <Input prefix={<span>+60</span>}></Input>
          </Form.Item>
          <Form.Item
            name={"address1"}
            label="Address"
            rules={[
              {
                required: true,
                message: "",
              },
              {
                max: 50,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*Address should be less than 50 characters</div>
                  </div>
                ),
              },
              {
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*The input is not valid Address</div>
                  </div>
                ),
                validator: (_, value) =>
                  RegexValidator(_, value, REGEX.ALPHABET_DIGIT_SPECIAL),
              },
            ]}
          >
            <Input placeholder="Address line 1"></Input>
          </Form.Item>
          <Form.Item
            name={"address2"}
            rules={[
              {
                max: 50,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*Address should be less than 50 characters</div>
                  </div>
                ),
              },
              {
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*The input is not valid Address</div>
                  </div>
                ),
                validator: (_, value) =>
                  RegexValidator(_, value, REGEX.ALPHABET_DIGIT_SPECIAL),
              },
            ]}
          >
            <Input placeholder="Address line 2"></Input>
          </Form.Item>
          <Form.Item
            name={"address3"}
            rules={[
              {
                max: 50,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*Address should be less than 50 characters</div>
                  </div>
                ),
              },
              {
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*The input is not valid Address</div>
                  </div>
                ),
                validator: (_, value) =>
                  RegexValidator(_, value, REGEX.ALPHABET_DIGIT_SPECIAL),
              },
            ]}
          >
            <Input placeholder="Address line 3"></Input>
          </Form.Item>
          <GroupHorizontal>
            <Form.Item
              name={"postalCodeAdmin"}
              label="Postal Code"
              style={{ width: "48%" }}
              rules={[
                {
                  required: true,
                  pattern: /^[0-9]{5}$/,
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>
                        *fill in Postal Code <br />
                        exactly to 5 digits
                      </div>
                    </div>
                  ),
                },
                {
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*The input is not valid Postal code</div>
                    </div>
                  ),
                  validator: (_, value) =>
                    RegexValidator(_, value, REGEX.DIGIT_ONLY),
                },
                {
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*Postal Code does not exist</div>
                    </div>
                  ),
                  validator: (_, value) => {
                    if (isInvalidPostalCodeAdmin) {
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                placeholder="00000"
                onBlur={(e) =>
                  addressDebounceFn(e?.target?.value, onChangePostalCodeAdmin)
                }
              />
            </Form.Item>
            <Form.Item
              name={"cityAdmin"}
              label="City"
              style={{ width: "48%" }}
              rules={[
                {
                  required: true,
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*fill in City</div>
                    </div>
                  ),
                },
                {
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*The input is not valid City</div>
                    </div>
                  ),
                  validator: (_, value) =>
                    RegexValidator(
                      _,
                      value.replaceAll(" ", ""),
                      REGEX.ALPHABET
                    ),
                },
              ]}
            >
              <Input placeholder="Type city" />
            </Form.Item>
          </GroupHorizontal>
          <GroupHorizontal>
            <Form.Item
              name={"stateAdmin"}
              label="State"
              style={{ width: "48%" }}
              rules={[
                {
                  required: true,
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*fill in State</div>
                    </div>
                  ),
                },
                {
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*The input is not valid State</div>
                    </div>
                  ),
                  validator: (_, value) =>
                    RegexValidator(
                      _,
                      value.replaceAll(" ", ""),
                      REGEX.ALPHABET
                    ),
                },
              ]}
            >
              <Input placeholder="Type state" />
            </Form.Item>
            <Form.Item
              name={"countryAdmin"}
              label="Country"
              style={{ width: "48%" }}
              rules={[
                {
                  required: true,
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*fill in Country</div>
                    </div>
                  ),
                },
                {
                  message: (
                    <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>*The input is not valid Country</div>
                    </div>
                  ),
                  validator: (_, value) =>
                    RegexValidator(
                      _,
                      value.replaceAll(" ", ""),
                      REGEX.ALPHABET
                    ),
                },
              ]}
            >
              <Input placeholder="Type country" />
            </Form.Item>
          </GroupHorizontal>
        </Card>
        <Row
          style={{ margin: "0vh 5vw 0vh 5vw" }}
          className="max-width-input text-left"
        >
          <Form.Item name={"isAuthorisedByCompany"} valuePropName="checked">
            <CheckboxCustom
              style={{ color: "white" }}
              className="text-x-small tune-confirm-checkbox"
            >
              I certify that I have been authorised by the Company to provide
              the information herein to Tune Protect Ventures Sdn Bhd and the
              information provided are accurate and complete.
            </CheckboxCustom>
          </Form.Item>
        </Row>
        <Row
          style={{ margin: "0vh 5vw 0vh 5vw" }}
          className="max-width-input text-left"
        >
          <Form.Item name={"isHrIdentityVerified"} valuePropName="checked">
            <CheckboxCustom
              style={{ color: "white" }}
              className="text-x-small tune-confirm-checkbox"
            >
              I have read and agree to Tune Protect Ventures Sdn Bhd's
              <a
                className="text-primary"
                href="https://www.tuneprotect.com/support/025619-Tune-Protect-Group-Privacy-Policy"
                target="_blank"
              >
                {" Privacy policy "}
              </a>
              and agree to perform an identity verification.
            </CheckboxCustom>
          </Form.Item>
        </Row>
        <Row
          className="w-100"
          style={{ margin: "3vh 0vw 3vh 0vw", justifyContent: "center" }}
        >
          <Form.Item shouldUpdate>
            {({ getFieldsValue }) => {
              const { isAuthorisedByCompany, isHrIdentityVerified } = getFieldsValue();
              return (
                <PrimaryButton
                  rootclass="max-width-button"
                  type="primary"
                  htmlType="submit"
                  isLoading={isSubmitting}
                  disabled={!isAuthorisedByCompany || !isHrIdentityVerified}
                  text="Next"
                />
              );
            }}
          </Form.Item>
        </Row>
      </Form>
    </BodyContent>
  );
}
