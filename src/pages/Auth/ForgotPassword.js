import {
  EyeFilled,
  EyeInvisibleFilled,
  LockFilled,
  MailFilled,
} from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Image, Input, Modal, Row } from "antd";
import { REGEX } from "common/constants/constants";
import { PAGE_LINK } from "common/constants/pagelinks";
import { RegexValidator } from "common/utils/validators";
import { NotificationDispatchContext } from "contexts/NotificationContext";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IdentityService } from "services/IdentityService/IdentityServices";
import styled from "styled-components";
import { ReactComponent as ErrorIcon } from "assets/images/icon-error-small.svg";
import PrimaryButton from "common/components/Button/PrimaryButton";
import logo from "assets/images/Group 74.png";

const StyledInput = styled(Input)`
  padding: 2px 12px !important;
  border-radius: 0.4rem !important;
`;

const InitialValue = {
  email: "",
  password: "",
  confirmPassword: "",
};

function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { updateNotification } = useContext(NotificationDispatchContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [resetPasswordData, setResetPasswordData] = useState(null);
  const [isFinish, setIsFinish] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const email = searchParams.get("email");

    setResetPasswordData({ code, email });
  }, []);

  const submitForm = async (val) => {
    console.log(resetPasswordData, val);
    try {
      setIsSubmitting(true);
      var rs = await IdentityService.ChangePassword({
        email: resetPasswordData.email,
        token: resetPasswordData.code,
        newPassword: val.password,
        confirmNewPassword: val.confirmPassword,
      });
      setIsSubmitting(false);

      if (rs) {
        setIsFinish(true);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="center-items d-flex-c" style={{ height: "70vh" }}>
      {isFinish ? (
        <div className="text-xx-large text-bold text-white">
          Password has been reset. Please click this{" "}
          <u
            className="text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            link
          </u>{" "}
          to go to home screen
        </div>
      ) : (
        <>
          <div className="text-xx-large text-bold text-white">
            Update your password
          </div>
          <Form
            name="basic"
            initialValues={InitialValue}
            size="small"
            form={form}
            onFinish={submitForm}
            id="save-quote-form"
            autoComplete="off"
            className="center-items d-flex-c text-white w-90"
          >
            <Col className="w-90 max-width-input">
              <div className="text-left w-100 mb-3">
                <label>Password</label>
                <Form.Item
                  name={"password"}
                  rules={[
                    {
                      required: true,
                      message: (
                        <div className="d-flex">
                          <ErrorIcon width={20}> </ErrorIcon>
                          <div>Please confirm your new password!</div>
                        </div>
                      ),
                    },
                    {
                      message: (
                        <div className="d-flex">
                          <ErrorIcon width={20}> </ErrorIcon>
                          <div>
                            Valid password must contain uppercase, lowercase,
                            special characters, numbers and has a least 8
                            characters!
                          </div>
                        </div>
                      ),

                      validator: (_, value) =>
                        RegexValidator(_, value, REGEX.PASSWORD),
                    },
                  ]}
                >
                  <StyledInput
                    placeholder="Key in your new password"
                    type={showPassword ? "text" : "password"}
                    prefix={<LockFilled style={{ color: "lightgrey" }} />}
                    suffix={
                      showPassword ? (
                        <EyeInvisibleFilled
                          style={{ color: "lightgrey" }}
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <EyeFilled
                          style={{ color: "lightgrey" }}
                          onClick={() => setShowPassword(true)}
                        />
                      )
                    }
                  />
                </Form.Item>
              </div>
              <div className="text-left w-100 mb-3">
                <label>Confirm Password</label>
                <Form.Item
                  name={"confirmPassword"}
                  dependencies={["password"]}
                  hasFeedback
                  required={true}
                  rules={[
                    {
                      required: true,
                      message: (
                        <div className="d-flex">
                          <ErrorIcon width={20}> </ErrorIcon>
                          <div>Please confirm your new password!</div>
                        </div>
                      ),
                    },
                    {
                      validator: (_, value) => {
                        if (
                          !value ||
                          form.getFieldValue("password") === value
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>
                              The two passwords that you entered do not match!
                            </div>
                          </div>
                        );
                      },
                    },
                  ]}
                >
                  <StyledInput
                    placeholder="Verify your new password"
                    type={showVerifyPassword ? "text" : "password"}
                    prefix={<LockFilled style={{ color: "lightgrey" }} />}
                    suffix={
                      showVerifyPassword ? (
                        <EyeInvisibleFilled
                          style={{ color: "lightgray" }}
                          onClick={() => setShowVerifyPassword(false)}
                        />
                      ) : (
                        <EyeFilled
                          style={{ color: "lightgrey" }}
                          onClick={() => setShowVerifyPassword(true)}
                        />
                      )
                    }
                  />
                </Form.Item>
              </div>
            </Col>
            <div className="mt-5 w-90 d-flex-c center-items">
              <PrimaryButton
                rootclass="max-width-button "
                text={"Change password"}
                htmlType="submit"
                isLoading={isSubmitting}
              />
            </div>
          </Form>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;
