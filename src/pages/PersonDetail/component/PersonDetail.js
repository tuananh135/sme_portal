import PrimaryButton from 'common/components/Button/PrimaryButton'
import chatImage from 'assets/images/nina-small.png'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Divider, Form, Input, Radio, Select, Checkbox, DatePicker, Upload, Image } from 'antd'
import { RegexValidator } from 'common/utils/validators'
import { FILE_TYPE, REGEX } from 'common/constants/constants'
import { MaskedInput } from 'antd-mask-input'
import usePostalCode from 'hooks/_usePostalCode'
import SubmitQuestionModal from 'common/components/Modal/SubmitQuestionModal'
import DateInput from 'common/components/Input/DateInput'
// import moment from 'moment';
import { ReactComponent as ErrorIcon } from 'assets/images/icon-error-small.svg'
import CustomError from './CustomError'
import { MEMBER_ERRORS } from 'common/constants/membersCheckingError'
import moment from 'moment'
import { CategoryStateContext } from 'contexts/CategoryContext'
import UploadDocumentComponent from 'pages/DirectorDetail/components/UploadDocumentComponent'
import { constructNewFileName, toBase64, validateFileTypeAndSize } from 'common/utils/fileUtils'
import { useParams } from 'react-router-dom'
import { NotificationDispatchContext } from 'contexts/NotificationContext'
import { CategoryService } from 'services/B2CService/CategoryService'
import { EmployeeGroupService } from 'services/B2CService/EmployeeGroupService'
import StepProgressTrigger from 'common/components/StepPanel/StepProgressTrigger'

const GroupHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const PageText = styled.div`
  font-weight: bold;
  justify-content: center;
  color: white;
  margin-top: 30px;
`
const Wrapper = styled.div`
  text-align: center;
`
const DatePickerCustom = styled(DatePicker)`
  padding: 0px 5px !important;
  input {
    font-size: 14px !important;
    padding: 10px !important;
  }
`
const FormCard = styled.div`
  padding: 15px;
  position: relative;
`
function PersonalDetail({ form, xlsxError, empData, onNext, hasDuplicateFields, setXlsxError }) {
  const { bankList, countryList } = useContext(CategoryStateContext)
  const { updateNotification } = useContext(NotificationDispatchContext)
  const [isBlockedCountry, setBlockedCountry] = useState(false)
  const [isBlockedName, setBlockedMemberName] = useState(false)
  const [isBlockedNric, setBlockedMemberNric] = useState(false)
  const [isBlockedPassport, setBlockedMemberPassport] = useState(false)
  const [isInvalidPostalCode, setInvalidPostalCode] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const { addressDebounceFn, address } = usePostalCode()
  const [isMalaysian, setIsMalaysian] = useState(empData?.nationality === 'MYS')

  const [date, setDate] = useState(new Date())
  const { id } = useParams()
  const [documents, setDocuments] = useState({
    visa: {
      Data: '',
      type: '',
    },
    passport: {
      Data: '',
      type: '',
    },
    visaCopy: {
      Data: '',
      type: '',
    },
  })

  useEffect(() => {
    form.validateFields()
  }, [])

  useEffect(() => {
    setIsMalaysian(empData?.nationality === 'MYS')
  }, [empData])

  useEffect(() => {
    form.validateFields(['nationality'])
  }, [isBlockedCountry])

  useEffect(() => {
    form.validateFields(['name'])
  }, [isBlockedName])

  useEffect(() => {
    form.validateFields(['nric'])
  }, [isBlockedNric])

  useEffect(() => {
    form.validateFields(['passport'])
  }, [isBlockedPassport])

  useEffect(() => {
    form.validateFields(['postalCode'])
  }, [isInvalidPostalCode])

  const handleSelectCountryChange = async (value, label) => {
    const countryRisk = await CategoryService.GetCountryByCountryName(label)
    if (countryRisk.data.item2 === true) {
      setBlockedCountry(true)
    } else {
      setBlockedCountry(false)
    }
  }

  const disabledDate = (current) => {
    // Disable dates after today
    return current && current.valueOf() > Date.now()
  }

  const onChangeCitizen = ($event) => {
    var malaysianCheck = $event.target.value === 'MYS'
    setIsMalaysian(malaysianCheck)
  }

  const onChangePostalCode = (address) => {
    form.setFieldValue(['address', 'city'], address?.City)
    form.setFieldValue(['address', 'state'], address?.State)
    form.setFieldValue(['address', 'country'], address?.Country)

    if (address?.City === undefined && address?.State === undefined) {
      setInvalidPostalCode(true)
    } else {
      setInvalidPostalCode(false)
    }
    form.validateFields(['address', 'postalCode'])
  }

  const checkBlackList = async () => {
    let checkList = []

    var isO_Cd = form.getFieldValue('nationality')

    var values = {}
    values.nric = form.getFieldValue('nric')
    values.passport = form.getFieldValue('passport')
    values.country = isO_Cd === undefined || isO_Cd === '' ? 'Malaysia' : countryList?.find((item) => item.isO_Cd.toLowerCase() === isO_Cd.toLowerCase()).country_Nm
    values.country_Add = form.getFieldValue(['address', 'country'])
    values.index = 0
    values.customerName = form.getFieldValue('name')

    checkList.push(values)

    const sanctionChecking = await EmployeeGroupService.CheckXlsxBlackList(checkList)
    let isSanctioned = false

    if (sanctionChecking[0]?.nameSanctioned) {
      setBlockedMemberName(true)
      isSanctioned = true
    }
    if (sanctionChecking[0]?.nricSanctioned) {
      setBlockedMemberNric(true)
      isSanctioned = true
    }
    if (sanctionChecking[0]?.passportSanctioned) {
      setBlockedMemberPassport(true)
      isSanctioned = true
    }
    if (sanctionChecking[0]?.countrySanctioned) {
      setBlockedCountry(true)
      isSanctioned = true
    }

    if (isSanctioned) return false
    return true
  }

  const handleSubmit = async () => {
    form.validateFields()
    checkBlackList()
    onNext()
  }

  const getUploadProps = (type, index, field) => {
    return {
      name: `file_${type}`,
      headers: {
        authorization: 'authorization-text',
      },
      onChange: async (info) => {
        const base64File = await toBase64(info.file)
        const newData = {
          type: type,
          base64: base64File,
          fileExtension: info.file.type,
          fileName: constructNewFileName(info.file.name?.replaceAll(' ', ''), type),
          employeeGroupId: id,
        }

        form.setFieldValue(field, newData)
        setDocuments((prev) => ({ ...prev, [type]: newData }))
        if (setXlsxError) {
          var currentError = xlsxError.findIndex((item) => item.field === type + '_copy')
          let newItem = xlsxError.filter((item, index) => index !== currentError)
          setXlsxError(newItem)
        }
        if (info.file.status !== 'uploading') {
        }
      },
      beforeUpload: beforeUpload,
      multiple: false,
      showUploadList: false,
    }
  }

  const beforeUpload = (file) => {
    const validateResult = validateFileTypeAndSize(file, FILE_TYPE.DIRECTOR_DOCUMENT, 3)
    if (validateResult.error) {
      updateNotification([
        {
          id: Math.random(),
          message: validateResult?.message,
          types: 'error',
        },
      ])
    }
    return validateResult.error ? Upload.LIST_IGNORE : false
  }

  return (
    <Wrapper className="w-80">
      <Image preview={false} width={60} style={{ marginTop: '5vh' }} src={chatImage} onClick={() => setShowQuestion(true)} />
      <PageText className="text-x-large text-center">
        Let's complete your personal <br />
        details here
      </PageText>
      <StepProgressTrigger className="mb-5" />
      <Form.Item
        name="name"
        label="Full Name"
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
            validator: (_, value) => RegexValidator(_, value, REGEX.ALPHABET_MAX),
          },
          {
            message: (
              <div key="error" className="d-flex">
                <ErrorIcon width={20}></ErrorIcon>
                <div>{MEMBER_ERRORS.NAME_VALIDATION.LONG}</div>
              </div>
            ),
            validator: (_, value) => RegexValidator(_, value, REGEX.ALPHABET_NAME),
          },
          {
            message: (
              <div key="error" className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>{MEMBER_ERRORS.NAME_SANCTION.LONG}</div>
              </div>
            ),
            validator: (_, value) => {
              if (isBlockedName) {
                return Promise.reject()
              }
              return Promise.resolve()
            },
          },
        ]}
      >
        <Input onChange={() => (xlsxError = null)} />
      </Form.Item>
      <CustomError xlsxError={xlsxError} fieldName="name" />

      <Form.Item
        name="citizen"
        label="Nationality"
        className="text-left red-radio"
        rules={[
          {
            required: true,
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>Choose Nationality</div>
              </div>
            ),
          },
        ]}
      >
        <Radio.Group onChange={onChangeCitizen}>
          <Radio className="text-white text-small" value="MYS" onClick={() => setIsMalaysian(true)}>
            Malaysian
          </Radio>
          <Radio className="text-white text-small" value="NonMYS" onClick={() => setIsMalaysian(false)}>
            Non-Malaysian
          </Radio>
        </Radio.Group>
      </Form.Item>
      <CustomError xlsxError={xlsxError} fieldName="citizen" />
      {isMalaysian && (
        <>
          <Form.Item
            name={'nric'}
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
              {
                message: (
                  <div key="error" className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>{MEMBER_ERRORS.NRIC_SANCTION.LONG}</div>
                  </div>
                ),
                validator: (_, value) => {
                  if (isBlockedNric) {
                    return Promise.reject()
                  }
                  return Promise.resolve()
                },
              },
              {
                message: (
                  <div key="error" className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>{MEMBER_ERRORS.DUPLICATE_NRIC.LONG}</div>
                  </div>
                ),
                validator: async (_, value) => {
                  if (!value) Promise.resolve()
                  const dependents = form.getFieldValue('dependents')
                  if (dependents?.some((d, i) => d?.nric === value)) {
                    return Promise.reject()
                  }
                  var checkResult = await hasDuplicateFields('nric', value)
                  if (checkResult) {
                    return Promise.reject()
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <MaskedInput mask={'000000-00-0000'} />
          </Form.Item>
          <CustomError xlsxError={xlsxError} fieldName="nric" />
        </>
      )}

      {!isMalaysian && (
        <>
          <Form.Item
            name={'passport'}
            label={'Passport Number'}
            rules={[
              {
                required: true,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*fill in Passport Number</div>
                  </div>
                ),
              },
              {
                message: (
                  <div key="error" className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>{MEMBER_ERRORS.PASSPORT_SANCTION.LONG}</div>
                  </div>
                ),
                validator: (_, value) => {
                  if (isBlockedPassport) {
                    return Promise.reject()
                  }
                  return Promise.resolve()
                },
              },
              {
                message: (
                  <div key="error" className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>{MEMBER_ERRORS.DUPLICATE_PASSPORT.LONG}</div>
                  </div>
                ),
                validator: async (_, value) => {
                  if (!value) Promise.resolve()
                  const dependents = form.getFieldValue('dependents')
                  if (dependents?.some((d, i) => d?.passport === value)) {
                    return Promise.reject()
                  }
                  var checkResult = await hasDuplicateFields('passport', value)
                  if (checkResult) {
                    return Promise.reject()
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <CustomError xlsxError={xlsxError} fieldName="passport" />

          <Form.Item
            name={'nationality'}
            label={'Nationality'}
            rules={[
              {
                required: true,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*choose Nationality</div>
                  </div>
                ),
              },
              {
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>{MEMBER_ERRORS.COUNTRY_SANCTION.SHORT}</div>
                  </div>
                ),
                validator: (_, value) => {
                  if (isBlockedCountry) {
                    return Promise.reject()
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Select
              className="text-left"
              popupClassName="payment-select-dropdown"
              options={countryList.map((item) => ({
                label: item.country_Nm,
                value: item.isO_Cd,
              }))}
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              onChange={(value, option) => handleSelectCountryChange(value, option.label)}
            />
          </Form.Item>
          <CustomError xlsxError={xlsxError} fieldName="nationality" />

          <Form.Item
            name={['visaIssueDate_display']}
            label={'Passport Expiry Date'}
            rules={[
              {
                required: true,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*choose Passport Expiry Date</div>
                  </div>
                ),
              },
            ]}
          >
            <DatePickerCustom
              size="large"
              format={'DD/MM/YYYY'}
              className="text-gray w-100 border-round"
              disabledDate={(d) => !d || d.isBefore(moment(Date.now()))}
              onChange={(e) => form.setFieldValue('visaIssueDate', e?.toISOString().replace('Z', ''))}
            />
          </Form.Item>
          <CustomError xlsxError={xlsxError} fieldName="visaIssueDate" />

          <Form.Item
            name={'visaExpiry_display'}
            label={'Current Working Visa Expiry'}
            rules={[
              {
                required: true,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*choose Current Working Visa Expiry</div>
                  </div>
                ),
              },
            ]}
          >
            <DatePickerCustom
              size="large"
              format={'DD/MM/YYYY'}
              className="text-gray w-100 border-round"
              disabledDate={(d) => !d || d.isBefore(moment(Date.now()))}
              onChange={(e) => form.setFieldValue('visaExpiry', e?.toISOString().replace('Z', ''))}
            />
          </Form.Item>
          <CustomError xlsxError={xlsxError} fieldName="visaExpiry" />
        </>
      )}

      <Form.Item
        name={'rank'}
        label="Ranking"
        rules={[
          {
            required: true,
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>*fill in Ranking</div>
              </div>
            ),
          },
          {
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>The input is not valid</div>
              </div>
            ),
            validator: (_, value) => RegexValidator(_, value, REGEX.DIGIT_ONLY),
          },
          {
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>{MEMBER_ERRORS.RANK_ERROR.LONG}</div>
              </div>
            ),
            validator: (_, value) => {
              if (value >= 1 && value <= 5) {
                return Promise.resolve()
              } else {
                return Promise.reject()
              }
            },
          },
        ]}
      >
        <Input placeholder="Type rank" />
      </Form.Item>
      <CustomError xlsxError={xlsxError} fieldName="rank" />

      {/* https://tune-protect.atlassian.net/browse/SMEB2C-184, When select non-Malaysian input Date of Birth and Gender */}
      {!isMalaysian && (
        <>
          <Form.Item
            name="dateOfBirth_display"
            label="Date Of Birth"
            rules={[
              {
                required: true,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*Choose Date of Birth</div>
                  </div>
                ),
              },
            ]}
          >
            <DatePickerCustom
              size="large"
              format={'DD/MM/YYYY'}
              className="text-gray w-100 border-round"
              disabledDate={(d) => !d || d.isAfter(moment(Date.now()))}
              onChange={(e) => form.setFieldValue('dateOfBirth', e?.format('DD/MM/YYYY'))}
            />
          </Form.Item>
          <CustomError xlsxError={xlsxError} fieldName="dateOfBirth" />
        </>
      )}

      {!isMalaysian && (
        <>
          <Form.Item
            name="gender"
            label="Gender"
            className="text-left red-radio"
            rules={[
              {
                required: true,
                message: (
                  <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>*Choose gender</div>
                  </div>
                ),
              },
            ]}
          >
            <Radio.Group>
              <Radio className="text-white text-small" value="Male">
                Male
              </Radio>
              <Radio className="text-white text-small" value="Female">
                Female
              </Radio>
            </Radio.Group>
          </Form.Item>
          <CustomError xlsxError={xlsxError} fieldName="gender" />

          <Form.List name="documents">
            {(fields, { add, remove }) => {
              return (
                <>
                  <p className="text-white text-left text-small mt-2">
                    Passport photo <br /> choose a file (pdf, jpg, png of max size: 3mb)
                  </p>
                  <FormCard className="text-left">
                    {fields?.map((field, index) => {
                      const currentValue = form.getFieldValue(['documents', index])
                      return (
                        <>
                          <Form.Item
                            name={[index]}
                            key={index}
                            rules={[
                              {
                                message: (
                                  <div className="d-flex">
                                    <ErrorIcon width={20}> </ErrorIcon>
                                    <div>*Document is required</div>
                                  </div>
                                ),
                                validator: (_, value) => {
                                  if (currentValue?.type === 'visaCopy' || (currentValue?.type !== 'visaCopy' && (currentValue?.base64 || currentValue?.url))) {
                                    return Promise.resolve()
                                  }
                                  return Promise.reject()
                                },
                              },
                            ]}
                          >
                            <UploadDocumentComponent
                              componentProps={getUploadProps(form.getFieldValue(['documents', index, 'type']), index, ['documents', index])}
                              uploadData={currentValue}
                              remove={(e) => {
                                e.stopPropagation()
                                form.setFieldValue(['documents', index], {
                                  ...currentValue,
                                  base64: '',
                                  fileExtension: '',
                                  fileName: '',
                                })
                              }}
                            />
                          </Form.Item>
                          <CustomError xlsxError={xlsxError} fieldName={`${form.getFieldValue(['documents', index, 'type'])}_copy`} />
                        </>
                      )
                    })}
                  </FormCard>
                </>
              )
            }}
          </Form.List>
        </>
      )}

      <Form.Item
        name={'bankName'}
        label="Bank Name"
        rules={[
          {
            required: true,
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>*fill in Bank Name</div>
              </div>
            ),
          },
        ]}
      >
        <Select
          className="text-left text-small person-detail-select"
          popupClassName="person-detail-dropdown"
          options={bankList.map((item) => ({
            label: item.bank_Nm,
            value: item.id,
          }))}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        />
      </Form.Item>
      <CustomError xlsxError={xlsxError} fieldName="bankName" />

      <Form.Item
        name={'bankAccount'}
        label="Bank Account"
        rules={[
          {
            required: true,
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>*fill in Bank Account</div>
              </div>
            ),
          },
          {
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>The input is not valid</div>
              </div>
            ),
            validator: (_, value) => RegexValidator(_, value, REGEX.DIGIT_ONLY),
          },
        ]}
      >
        <Input placeholder="Type bank account" />
      </Form.Item>
      <CustomError xlsxError={xlsxError} fieldName="bankAccount" />

      <Form.List name={['dependents']}>
        {() => {
          return (
            <>
              <Form.Item name={[0, 'noDependent']} label="No. Of Dependent">
                <Select
                  className="text-left text-small person-detail-select"
                  popupClassName="person-detail-dropdown"
                  onChange={(val) => {
                    const dependents = form.getFieldValue('dependents')
                    if (dependents && !!dependents.length) {
                      dependents[0].noDependent = val
                    }
                    form.setFieldValue('dependents', dependents)
                  }}
                >
                  <Select.Option key={0} value={0}>
                    {0}
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    {1}
                  </Select.Option>
                  <Select.Option key={2} value={2}>
                    {2}
                  </Select.Option>
                  <Select.Option key={3} value={3}>
                    {3}
                  </Select.Option>
                  <Select.Option key={4} value={4}>
                    {4}
                  </Select.Option>
                </Select>
              </Form.Item>
              {[...Array(!!form.getFieldValue('dependents') ? form.getFieldValue('dependents')[0]?.noDependent : 0).keys()].map((_, memIndex) => (
                <div key={memIndex}>
                  <Divider style={{ color: '#bfbfbf', borderColor: '#bfbfbf' }} plain>
                    Dependent {memIndex + 1}
                  </Divider>
                  <Form.Item
                    name={[memIndex, 'name']}
                    label="Dependent's Full Name"
                    rules={[
                      {
                        required: true,
                        message: (
                          <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>*fill in Full Name</div>
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
                        validator: (_, value) => RegexValidator(_, value, REGEX.ALPHABET),
                      },
                    ]}
                  >
                    <Input placeholder="Type Full Name (Family Member)" />
                  </Form.Item>
                  <CustomError xlsxError={xlsxError?.dependents?.length > 0 ? xlsxError?.dependents[memIndex] : null} fieldName="name" />

                  <Form.Item
                    name={[memIndex, 'relationship']}
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
                          value: 'Spouse',
                          label: 'Spouse',
                        },
                        {
                          value: 'Child',
                          label: 'Child/ Children',
                        },
                      ]}
                    />
                  </Form.Item>
                  <CustomError xlsxError={xlsxError?.dependents?.length > 0 ? xlsxError?.dependents[memIndex] : null} fieldName="relationship" />

                  <Form.Item
                    name={[memIndex, 'citizen']}
                    label="Nationality"
                    className="text-left"
                    rules={[
                      {
                        required: true,
                        message: (
                          <div className="d-flex">
                            <ErrorIcon width={20}> </ErrorIcon>
                            <div>*choose Nationality</div>
                          </div>
                        ),
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio className="text-white text-small red-radio" value="MYS">
                        Malaysian
                      </Radio>
                      <Radio className="text-white text-small red-radio" value="NonMYS">
                        Non-Malaysian
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <CustomError xlsxError={xlsxError?.dependents?.length > 0 ? xlsxError?.dependents[memIndex] : null} fieldName="citizen" />
                  <Form.Item shouldUpdate={true} className="dependent-section">
                    {({ getFieldValue }) => {
                      return getFieldValue(['dependents', memIndex, 'citizen']) === 'MYS' ? (
                        <div>
                          <Form.Item
                            name={[memIndex, 'nric']}
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
                              {
                                message: (
                                  <div key="error" className="d-flex">
                                    <ErrorIcon width={20}> </ErrorIcon>
                                    <div>{MEMBER_ERRORS.DUPLICATE_NRIC.LONG}</div>
                                  </div>
                                ),
                                validator: async (_, value) => {
                                  if (!value) Promise.resolve()
                                  const dependents = getFieldValue('dependents')
                                  if (dependents?.some((d, i) => i !== memIndex && d?.nric === value)) {
                                    return Promise.reject()
                                  }
                                  const checkResult = await hasDuplicateFields('nric', value)
                                  if (checkResult) {
                                    return Promise.reject()
                                  }
                                  return Promise.resolve()
                                },
                              },
                            ]}
                          >
                            <MaskedInput mask={'000000-00-0000'} />
                          </Form.Item>
                          <CustomError xlsxError={xlsxError?.dependents?.length > 0 ? xlsxError?.dependents[memIndex] : null} fieldName="nric" />
                        </div>
                      ) : (
                        <>
                          {' '}
                          <Form.Item
                            name={[memIndex, 'passport']}
                            label={'Passport Number'}
                            rules={[
                              {
                                required: true,
                                message: (
                                  <div className="d-flex">
                                    <ErrorIcon width={20}> </ErrorIcon>
                                    <div>*fill in Passport Number</div>
                                  </div>
                                ),
                              },
                              {
                                message: (
                                  <div key="error" className="d-flex">
                                    <ErrorIcon width={20}> </ErrorIcon>
                                    <div>{MEMBER_ERRORS.DUPLICATE_PASSPORT.LONG}</div>
                                  </div>
                                ),
                                validator: async (_, value) => {
                                  if (!value) Promise.resolve()
                                  const dependents = getFieldValue('dependents')
                                  if (dependents?.some((d, i) => i !== memIndex && d?.passport === value)) {
                                    return Promise.reject()
                                  }
                                  var checkResult = await hasDuplicateFields('passport', value)
                                  if (checkResult) {
                                    return Promise.reject()
                                  }
                                  return Promise.resolve()
                                },
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <CustomError xlsxError={xlsxError} fieldName="passport" />
                          <Form.Item
                            name={[memIndex, 'nationality']}
                            label={'Nationality'}
                            rules={[
                              {
                                required: true,
                                message: (
                                  <div className="d-flex">
                                    <ErrorIcon width={20}> </ErrorIcon>
                                    <div>*choose Nationality</div>
                                  </div>
                                ),
                              },
                            ]}
                          >
                            <Select
                              className="text-left"
                              popupClassName="payment-select-dropdown"
                              options={countryList.map((item) => ({
                                label: item.country_Nm,
                                value: item.isO_Cd,
                              }))}
                              showSearch
                              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            />
                          </Form.Item>
                          <CustomError xlsxError={xlsxError} fieldName="nationality" />
                          <Form.Item
                            name={[memIndex, 'visaIssueDate_display']}
                            label={'Passport Expiry Date'}
                            rules={[
                              {
                                required: true,
                                message: (
                                  <div className="d-flex">
                                    <ErrorIcon width={20}> </ErrorIcon>
                                    <div>*choose Passport Expiry Date</div>
                                  </div>
                                ),
                              },
                            ]}
                          >
                            <DatePickerCustom
                              size="large"
                              format={'DD/MM/YYYY'}
                              className="text-gray w-100 border-round"
                              disabledDate={(d) => !d || d.isBefore(moment(Date.now()))}
                              onChange={(e) => form.setFieldValue(['dependents', memIndex, 'visaIssueDate'], e?.toISOString().replace('Z', ''))}
                            />
                          </Form.Item>
                          <CustomError xlsxError={xlsxError} fieldName="visaIssueDate" />
                          <Form.Item
                            name={[memIndex, 'visaExpiry_display']}
                            label={'Current Working Visa Expiry'}
                            rules={[
                              {
                                required: true,
                                message: (
                                  <div className="d-flex">
                                    <ErrorIcon width={20}> </ErrorIcon>
                                    <div>*choose Current Working Visa Expiry</div>
                                  </div>
                                ),
                              },
                            ]}
                          >
                            <DatePickerCustom
                              size="large"
                              format={'DD/MM/YYYY'}
                              className="text-gray w-100 border-round"
                              disabledDate={(d) => !d || d.isBefore(moment(Date.now()))}
                              onChange={(e) => form.setFieldValue(['dependents', memIndex, 'visaExpiry'], e?.toISOString().replace('Z', ''))}
                            />
                          </Form.Item>
                          <CustomError xlsxError={xlsxError} fieldName="visaExpiry" />
                          <Form.Item
                            name={[memIndex, 'dateOfBirth_display']}
                            label="Date Of Birth"
                            rules={[
                              {
                                required: true,
                                message: (
                                  <div className="d-flex">
                                    <ErrorIcon width={20}> </ErrorIcon>
                                    <div>*Choose Date of Birth</div>
                                  </div>
                                ),
                              },
                            ]}
                          >
                            <DatePickerCustom
                              size="large"
                              format={'DD/MM/YYYY'}
                              className="text-gray w-100 border-round"
                              disabledDate={(d) => !d || d.isAfter(moment(Date.now()))}
                              onChange={(e) => form.setFieldValue(['dependents', memIndex, 'dateOfBirth'], e?.format('DD/MM/YYYY'))}
                            />
                          </Form.Item>
                          <CustomError xlsxError={xlsxError} fieldName="dateOfBirth" />
                          <Form.Item
                            name={[memIndex, 'gender']}
                            label="Gender"
                            className="text-left red-radio"
                            rules={[
                              {
                                required: true,
                                message: (
                                  <div className="d-flex">
                                    <ErrorIcon width={20}> </ErrorIcon>
                                    <div>*Choose gender</div>
                                  </div>
                                ),
                              },
                            ]}
                          >
                            <Radio.Group>
                              <Radio className="text-white text-small" value="Male">
                                Male
                              </Radio>
                              <Radio className="text-white text-small" value="Female">
                                Female
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                          <CustomError xlsxError={xlsxError} fieldName="gender" />
                          {/* <Form.List name={[memIndex, "documents"]}>
                            {(fields, { add, remove }) => {
                              return (
                                <>
                                  <p className="text-white text-left text-small mt-2">
                                    Passport photo <br /> choose a file (pdf,
                                    jpg, png of max size: 3mb)
                                  </p>
                                  <FormCard className="text-left">
                                    {fields?.map((field, index) => {
                                      const currentValue = form.getFieldValue([
                                        "dependents", memIndex, "documents", index
                                      ]);
                                      return (
                                        <Form.Item name={[index]}>
                                          <UploadDocumentComponent
                                            componentProps={getUploadProps(
                                              form.getFieldValue([
                                                "dependents", memIndex, "documents", index, "type"]
                                              ),
                                              index,
                                              ["dependents", memIndex, "documents", index]
                                            )}
                                            uploadData={currentValue}
                                            remove={(e) => {
                                              e.stopPropagation();
                                              form.setFieldValue(
                                                ["dependents", memIndex, "documents", index],
                                                {
                                                  ...currentValue,
                                                  base64: "",
                                                  fileExtension: "",
                                                  fileName: "",
                                                }
                                              );
                                            }}
                                          />
                                        </Form.Item>
                                      );
                                    })}
                                  </FormCard>
                                </>
                              );
                            }}
                          </Form.List> */}
                        </>
                      )
                    }}
                  </Form.Item>
                </div>
              ))}
            </>
          )
        }}
      </Form.List>
      <Divider style={{ color: '#bfbfbf', borderColor: '#bfbfbf' }}></Divider>
      <Form.Item
        name="email"
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
        <Input />
      </Form.Item>
      <CustomError xlsxError={xlsxError} fieldName="email" />

      <Form.Item
        name={['address', 'addressLine1']}
        label="Address"
        rules={[
          {
            required: true,
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>*fill in Address</div>
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
            validator: (_, value) => RegexValidator(_, value, REGEX.ALPHABET_DIGIT_SPECIAL),
          },
        ]}
      >
        <Input className="mb-2" placeholder="Address line 1" />
      </Form.Item>

      <Form.Item
        name={['address', 'addressLine2']}
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
            validator: (_, value) => RegexValidator(_, value, REGEX.ALPHABET_DIGIT_SPECIAL),
          },
        ]}
      >
        <Input className="mb-2" placeholder="Address line 2" />
      </Form.Item>
      <Form.Item
        name={['address', 'addressLine3']}
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
            validator: (_, value) => RegexValidator(_, value, REGEX.ALPHABET_DIGIT_SPECIAL),
          },
        ]}
      >
        <Input placeholder="Address line 3" />
      </Form.Item>
      <GroupHorizontal>
        <Form.Item
          name={['address', 'postalCode']}
          style={{ width: '48%' }}
          label="Postal Code"
          rules={[
            {
              required: true,
              message: (
                <div className="d-flex">
                  <ErrorIcon width={20}> </ErrorIcon>
                  <div>*fill in Postal Code</div>
                </div>
              ),
            },
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
              validator: (_, value) => RegexValidator(_, value, REGEX.DIGIT_ONLY),
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
                  return Promise.reject()
                }
                return Promise.resolve()
              },
            },
          ]}
          validateTrigger="onBlur"
          initialValues={{ address: { postalCode: '' } }}
        >
          <Input onChange={(e) => addressDebounceFn(e?.target?.value, onChangePostalCode)} />
        </Form.Item>
        <Form.Item
          name={['address', 'city']}
          style={{ width: '48%' }}
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
              validator: (_, value) => RegexValidator(_, value.replaceAll(' ', ''), REGEX.ALPHABET),
            },
          ]}
        >
          <Input />
        </Form.Item>
      </GroupHorizontal>
      <GroupHorizontal>
        <Form.Item
          name={['address', 'state']}
          style={{ width: '48%' }}
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
              validator: (_, value) => RegexValidator(_, value.replaceAll(' ', ''), REGEX.ALPHABET),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['address', 'country']}
          style={{ width: '48%' }}
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
              validator: (_, value) => RegexValidator(_, value.replaceAll(' ', ''), REGEX.ALPHABET),
            },
          ]}
        >
          <Input readOnly />
        </Form.Item>
      </GroupHorizontal>
      <Form.Item
        name="mobileNumber"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>*fill in Phone Number</div>
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
            validator: (_, value) => RegexValidator(_, value, REGEX.PHONE_NUMBER),
          },
        ]}
      >
        <Input prefix={<span>+60</span>}></Input>
      </Form.Item>
      <CustomError xlsxError={xlsxError} fieldName="mobileNumber" />

      <p className="text-white text-small text-left mb-0 mt-3">
        Do you or your immediate family members/close associates hold, or previously held or is being considered for prominent public position?
      </p>
      <Form.Item
        className="text-left"
        name="pep"
        rules={[
          {
            required: true,
            message: (
              <div className="d-flex">
                <ErrorIcon width={20}> </ErrorIcon>
                <div>*choose an option</div>
              </div>
            ),
          },
        ]}
      >
        <Radio.Group>
          <Radio className="text-white text-small red-radio" value="Yes">
            YES
          </Radio>
          <Radio className="text-white text-small red-radio" value="No">
            NO
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item style={{ textAlign: 'left' }} shouldUpdate={true}>
        {({ getFieldValue }) => {
          return getFieldValue(['pep'])?.toLowerCase() === 'yes' ? (
            <>
              <p className="mt-3 text-small text-white">Who is involve?</p>
              <Form.Item
                name={['personInvolve']}
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="d-flex">
                        <ErrorIcon width={20}> </ErrorIcon>
                        <div>*choose an option</div>
                      </div>
                    ),
                  },
                ]}
              >
                <Radio.Group>
                  <Radio className="text-white text-small red-radio d-block mb-2" value="MySelf">
                    Myself
                  </Radio>
                  <Radio className="text-white text-small red-radio d-block mb-2" value="MySelfFamilyMemberOnly">
                    Myself and family member
                  </Radio>
                  <Radio className="text-white text-small red-radio d-block" value="FamilyMemberOnly">
                    Family Member only
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </>
          ) : null
        }}
      </Form.Item>
      <Divider style={{ color: '#bfbfbf', borderColor: '#bfbfbf' }}></Divider>
      <div className="w-100 text-center mb-5">
        <PrimaryButton text={'SAVE & CLOSE'} onClick={handleSubmit} rootclass="" />
      </div>
      <SubmitQuestionModal show={showQuestion} setShow={setShowQuestion}></SubmitQuestionModal>
    </Wrapper>
  )
}

export default PersonalDetail
