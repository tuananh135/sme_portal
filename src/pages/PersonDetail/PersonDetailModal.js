import { Form, Modal } from 'antd'
import ChatIcon from 'common/components/ChatIcon/ChatIcon'
import moment from 'moment'
import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import PersonalDetail from './component/PersonDetail'
import PersonalPEP from './component/PoliticallyExpose'
import HealthQuestion from 'pages/HealthQuestion/HealthQuestion'
import PersonDetailInfo from 'pages/PersonDetail/component/PersonDetailInfo'
import { getAgeFromNRIC } from 'common/utils/dateUtils'
import { FRIENDLY_MESSAGE, HEALTH_QUESTIONS } from 'common/constants/constants'
import { NotificationDispatchContext } from 'contexts/NotificationContext'
import _ from 'lodash'
import { UWStatus, checkHealthQuestionsPassed } from 'common/utils/healthQuestionUtil'
import usePostalCode from 'hooks/_usePostalCode'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const FormContainer = styled.div`
  //width: 80%;
  margin-bottom: 200px;
  max-width: 600px;
`

const InitialValue = {
  groupId: '00000000-0000-0000-0000-000000000000',
  addressId: '00000000-0000-0000-0000-000000000000',
  name: '',
  nric: '',
  nationality: '',
  dateOfBirth: '',
  email: '',
  role: null,
  orgName: null,
  position: null,
  positionYears: 0,
  mobileNumber: '',
  mobileCountry: null,
  rank: 0,
  gender: '',
  bankAccount: null,
  bankName: null,
  pep: null,
  type: 'EMPLOYEE',
  status: 1,
  isDeleted: false,
  lastModificationTime: null,
  lastModifierUserEmail: null,
  protectorId: null,
  dependents: [],
  documents: [{ type: 'passport' }, { type: 'visa' }, { type: 'visaCopy' }],
  relationship: 'employee',
  joiningDate: moment(new Date()).format('dd/MM/yyyy'),
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    id: '00000000-0000-0000-0000-000000000000',
  },
  id: '00000000-0000-0000-0000-000000000000',
}

function PersonDetailModal({ data, empData, onClose, onAddNewEmp, onEditEmp, underwritingQuestion, hasDuplicateFields }) {
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateNotification } = useContext(NotificationDispatchContext)
  const [xlsxError, setXlsxError] = useState([])
  const { addressDebounceFn, address } = usePostalCode()

  useEffect(() => {
    setCurrentStep(0)
    if (!empData) {
      form.setFieldsValue(InitialValue)
      form.setFieldValue(['dependents'], [{ noDependent: 0 }])
    } else {
      form.resetFields()
      form.setFieldsValue(empData)

      if (empData.dependents?.length) {
        empData.dependents[0].noDependent = empData.dependents[0].noDependent ?? empData.dependents.length
        empData.dependents.forEach((dep) => {
          dep.documents = [{ type: 'passport' }, { type: 'visa' }, { type: 'visaCopy' }]
        })
        form.setFieldValue(['dependents'], empData.dependents)
      } else {
        form.setFieldValue(['dependents'], [{ noDependent: 0 }])
      }

      if (empData.documents?.length > 0) {
      } else {
        form.setFieldValue(['documents'], [{ type: 'passport' }, { type: 'visa' }, { type: 'visaCopy' }])
      }

      form.setFieldValue('key', empData.key)
      if (empData?.errorStatus) {
        let status = empData?.errorStatus
        status.dependents = empData.dependents?.map((item) => {
          return item.errorStatus
        })
        setXlsxError(status)
      }
    }

    return () => {
      form.resetFields()
    }
  }, [empData, data?.display])

  const closeModal = () => {
    form.resetFields()
    setCurrentStep(0)
    onClose()
  }

  const onFinish = (val) => {
    form.resetFields()
    if (data?.type === 1) onAddNewEmp(val)
    else onEditEmp(val)
    form.resetFields()
  }

  const onNext = async () => {
    await form.validateFields()
    var updatedErrors = xlsxError
    const pep = form.getFieldValue('pep').toLowerCase()
    const nric = form.getFieldValue('nric')
    const postalcode = form.getFieldValue(['address', 'postalCode'])
    const addressResult = await new Promise((resolve) => {
      addressDebounceFn(postalcode, (address) => {
        resolve({ ...address })
      })
    })
    if (addressResult?.City !== undefined && addressResult?.State !== undefined) {
      updatedErrors = xlsxError.filter((error) => error.field !== 'address.postalCode')
      setXlsxError(updatedErrors)
    }
    const formError = updatedErrors?.filter((item) => item?.field !== 'healthQuestions' && item?.field !== 'pepDeclaration')
    if (formError?.length > 0) {
      updateNotification([
        {
          id: Math.random(),
          message: 'There are still errors in employee data!',
          types: 'error',
        },
      ])
      return
    }
    if (updatedErrors.dependents?.some((d) => d?.length > 0)) {
      updateNotification([
        {
          id: Math.random(),
          message: 'There are still errors in employee data!',
          types: 'error',
        },
      ])
      return
    }

    if ((empData && empData.underwritingQuestion) || getAgeFromNRIC(nric) > 65 || underwritingQuestion) {
      form.setFieldValue('underwritingQuestion', true)
      if (currentStep === 0) {
        if (pep === 'no') {
          setCurrentStep((prev) => prev + 2)
          return
        }
      }
    } else {
      if (currentStep === 0) {
        if (pep === 'no') {
          setCurrentStep((prev) => prev + 3)
          return
        }
      }
      if (currentStep === 1) {
        setCurrentStep((prev) => prev + 2)
        return
      }
    }
    const newStep = currentStep === steps.length - 1 ? currentStep : currentStep + 1
    setCurrentStep(newStep)
  }

  const onBack = () => {
    const pep = form.getFieldValue('pep').toLowerCase()
    if (pep === 'no') {
      setCurrentStep((prev) => prev - 2)
    } else {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const onPEPBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const onReset = () => {
    setCurrentStep(0)
  }

  const onSubmit = () => {
    const formData = form.getFieldsValue(true)
    const haveToCheckUw = form.getFieldValue('underwritingQuestion')
    if (!!haveToCheckUw) {
      var result = checkHealthQuestionsPassed(formData)
      if (result != UWStatus.PASSED) {
        updateNotification([
          {
            id: Math.random(),
            message: FRIENDLY_MESSAGE[result],
            types: 'error',
          },
        ])
        return
      }
    }

    if (formData?.pepDeclaration?.member) {
      const copyXlsx = xlsxError.filter((item) => item.field !== 'pepDeclaration')
      setXlsxError(copyXlsx)
    }

    if (data?.type === 1) {
      onAddNewEmp(formData)
    } else {
      onEditEmp(formData)
    }
  }

  const steps = [
    {
      component: <PersonalDetail form={form} xlsxError={xlsxError} empData={empData} onNext={onNext} hasDuplicateFields={hasDuplicateFields} setXlsxError={setXlsxError} />,
    },
    { component: <PersonalPEP form={form} onNext={onNext} onBack={onPEPBack} /> },
    {
      component: <HealthQuestion form={form} onNext={onNext} onBack={onBack} />,
    },
    {
      component: <PersonDetailInfo data={form.getFieldsValue(true)} onEdit={onReset} onSave={onSubmit} isSubmitting={isSubmitting} />,
    },
  ]

  const onFieldChange = (event) => {
    // Event when click change pep involve
    const name = _.get(event[0], 'name[0]', null)
    if (name == 'personInvolve') {
      const personInvolve = _.get(event[0], 'value', '').toLowerCase()
      const pep = form.getFieldValue(['pepDeclaration'])
      if (!pep) {
        form.setFieldValue('pepDeclaration', {
          member: personInvolve.includes('myself')
            ? {
                name: form.getFieldValue('name'),
                nric: form.getFieldValue('nric'),
              }
            : null,
          family: personInvolve.includes('familymember') ? [{}] : [],
        })
      } else {
        if (personInvolve.includes('myself') && !pep.member) {
          form.setFieldValue('pepDeclaration', {
            ...pep,
            member: {
              name: form.getFieldValue('name'),
              nric: form.getFieldValue('nric'),
            },
          })
        }
        if (personInvolve.includes('familymember') && (!pep.family || !pep.family.length)) {
          form.setFieldValue('pepDeclaration', {
            ...pep,
            family: [{}],
          })
        }
      }
    }

    if (xlsxError?.length === 0 && !xlsxError?.dependents?.some((d) => d.length > 0)) return
    console.log('onFieldChange', event)
    if (event?.length > 0) {
      if (event[0]?.errors?.length === 0) {
        const eventName = event[0].name
        if (eventName.includes('dependents')) {
          const currentDepIndex = eventName[1]
          const currentFieldChange = eventName[2]
          if (xlsxError?.dependents?.length > currentDepIndex) {
            var currentError = xlsxError?.dependents[currentDepIndex]?.findIndex((item) => item.field === currentFieldChange?.replaceAll('_display', ''))
            let newXlsxError = [...xlsxError]
            xlsxError.dependents[currentDepIndex] = xlsxError.dependents[currentDepIndex]?.filter((item, index) => index !== currentError)
            newXlsxError.dependents = xlsxError.dependents
            console.log('currentError', newXlsxError)
            setXlsxError(newXlsxError)
          }

          return
        }
        var currentError = xlsxError.findIndex((item) => item.field === event[0].name[0]?.replaceAll('_display', ''))
        let newItem = xlsxError.filter((item, index) => index !== currentError)
        newItem.dependents = xlsxError.dependents
        console.log('currentError', newItem)
        setXlsxError(newItem)
      }
    }
  }

  return (
    <Modal open={data?.display} onOk={closeModal} onCancel={closeModal} okText="Ok" cancelText="Cancel" className="person-detail text-white d-flex" footer={null}>
      <Wrapper>
        <FormContainer>
          <Form
            name="basic"
            initialValues={{ ...empData }}
            size="small"
            onFinish={onNext}
            onFinishFailed={(e) => console.log(e)}
            onFieldsChange={onFieldChange}
            form={form}
            labelCol={{ span: 24 }}
            className="person-detail-form center-items"
            autoComplete="off"
          >
            {steps[currentStep]?.component}
          </Form>
        </FormContainer>
      </Wrapper>
    </Modal>
  )
}

export default PersonDetailModal
