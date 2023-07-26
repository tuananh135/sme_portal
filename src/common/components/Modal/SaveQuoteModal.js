import { EyeFilled, EyeInvisibleFilled, LockFilled, MailFilled } from '@ant-design/icons'
import { Button, Checkbox, Col, Form, Input, Modal, Row } from 'antd'
import { REGEX } from 'common/constants/constants'
import { PAGE_LINK } from 'common/constants/pagelinks'
import { RegexValidator } from 'common/utils/validators'
import { NotificationDispatchContext } from 'contexts/NotificationContext'
import { useForm } from 'rc-field-form'
import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IdentityService } from 'services/IdentityService/IdentityServices'
import styled from 'styled-components'
import CancelButton from '../Button/CancelButton'
import PrimaryButton from '../Button/PrimaryButton'
import ChatIcon from '../ChatIcon/ChatIcon'
import { ReactComponent as ErrorIcon } from 'assets/images/icon-error-small.svg'

const StyledInput = styled(Input)`
  padding: 2px 12px !important;
  border-radius: 0.4rem !important;
`

const InitialValue = {
  email: '',
  password: '',
  confirmPassword: '',
}

function SaveQuoteModal({ show, setShow, nextPage, isLogin, setLogin, saveQuote }) {
  const [check, setCheck] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showVerifyPassword, setShowVerifyPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(isLogin)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { updateNotification } = useContext(NotificationDispatchContext)

  const hideModal = () => {
    setCheck(false)
    setShowPassword(false)
    setShow(false)
    setLogin(false)
  }

  const login = () => {
    nextPage()
  }

  const submitForm = async (val) => {
    console.log(val)
    val.affiliateCode = localStorage.getItem('affiliate_code')
    try {
      const user = await IdentityService.RegisterUser(val)
      await saveQuote(false, user)
      setLogin(true)
    } catch (error) {
      updateNotification([
        {
          id: Math.random(),
          message: (
            <div className="d-flex">
              <ErrorIcon width={20}> </ErrorIcon>
              <div>Error during execution!</div>
            </div>
          ),
          types: 'error',
        },
      ])
    }
  }
  return (
    <Modal open={show} onOk={hideModal} onCancel={hideModal} okText="Ok" cancelText="Cancel" className="save-quote text-white d-flex" footer={null} o>
      <ChatIcon width={50} className="mb-2" />
      {isLogin ? (
        <div className="mt-5 max-width-input">
          A unique link is SUCCESSFULLY sent to <span className="text-underline">{form.getFieldValue('email')}</span> <br />
          You can come back to this page anytime by open that link
        </div>
      ) : (
        <Form
          name="basic"
          initialValues={InitialValue}
          size="small"
          form={form}
          onFinish={submitForm}
          id="save-quote-form"
          autoComplete="off"
          className="center-items d-flex-c text-white"
        >
          <div>
            <p>To create an account, please enter your email and create</p>
            <p>your password. A unique link will be sent to your email...</p>
          </div>
          <Col className="w-90 max-width-input">
            <div className="text-left w-100 mb-3">
              <label>Email</label>
              <Form.Item
                name={'email'}
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>Email is required!</div>
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
                <StyledInput placeholder="email@domain.com" prefix={<MailFilled style={{ color: 'lightgray' }} />} />
              </Form.Item>
            </div>
            <div className="text-left w-100 mb-3">
              <label>Password</label>
              <Form.Item
                name={'password'}
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>Please confirm your password!</div>
                      </div>
                    ),
                  },
                  {
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>Valid password must contain uppercase, lowercase, special characters, numbers and has a least 8 characters!</div>
                      </div>
                    ),

                    validator: (_, value) => RegexValidator(_, value, REGEX.PASSWORD),
                  },
                ]}
              >
                <StyledInput
                  placeholder="Key in your password"
                  type={showPassword ? 'text' : 'password'}
                  prefix={<LockFilled style={{ color: 'lightgrey' }} />}
                  suffix={
                    showPassword ? (
                      <EyeInvisibleFilled style={{ color: 'lightgrey' }} onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeFilled style={{ color: 'lightgrey' }} onClick={() => setShowPassword(true)} />
                    )
                  }
                />
              </Form.Item>
            </div>
            <div className="text-left w-100 mb-3">
              <label>Confirm Password</label>
              <Form.Item
                name={'confirmPassword'}
                dependencies={['password']}
                hasFeedback
                required={true}
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>Please confirm your password!</div>
                      </div>
                    ),
                  },
                  {
                    validator: (_, value) => {
                      if (!value || form.getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(
                        <div className="d-flex">
                          <ErrorIcon width={20}> </ErrorIcon>
                          <div>The two passwords that you entered do not match!</div>
                        </div>,
                      )
                    },
                  },
                ]}
              >
                <StyledInput
                  placeholder="Verify your password"
                  type={showVerifyPassword ? 'text' : 'password'}
                  prefix={<LockFilled style={{ color: 'lightgrey' }} />}
                  suffix={
                    showVerifyPassword ? (
                      <EyeInvisibleFilled style={{ color: 'lightgray' }} onClick={() => setShowVerifyPassword(false)} />
                    ) : (
                      <EyeFilled style={{ color: 'lightgrey' }} onClick={() => setShowVerifyPassword(true)} />
                    )
                  }
                />
              </Form.Item>
            </div>
          </Col>

          <Col className="w-90 max-width-input">
            <Checkbox onChange={() => setCheck((prev) => !prev)} className="text-white text-x-small text-left mb-5 center-items tune-confirm-checkbox" style={{ float: 'left' }}>
              By selecting “Create account”, I hereby confirm that I have read and agree to Tune Protect Ventures Sdn Bhd’s{' '}
              <a className="text-primary" href="https://www.tuneprotect.com/support/025619-Tune-Protect-Group-Privacy-Policy">
                Privacy policy
              </a>
            </Checkbox>
          </Col>

          <Col className="w-90 max-width-input">
            <Checkbox className="text-white text-x-small text-left mb-5 center-items tune-confirm-checkbox" style={{ float: 'left' }} checked={true}>
              I agree to receive emails from Tune Protect Ventures Sdn Bhd.
            </Checkbox>
          </Col>
          <div className="mt-5 w-90 d-flex-c center-items">
            {check ? (
              <PrimaryButton rootclass="max-width-button " text={'Create account'} htmlType="submit" />
            ) : (
              <CancelButton rootclass="max-width-button " disabled={true} text={'Create account'} />
            )}
            {nextPage && (
              <span className="pt-2">
                Already have an account?{' '}
                <b className="text-bold text-primary text-underline cursor-pointer" onClick={login}>
                  Log in
                </b>
              </span>
            )}
          </div>
        </Form>
      )}
    </Modal>
  )
}

export default SaveQuoteModal
