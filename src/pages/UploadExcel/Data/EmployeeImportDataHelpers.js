import { REGEX } from 'common/constants/constants'
import { MEMBER_ERRORS } from 'common/constants/membersCheckingError'
import { getAgeFromDoB, getAgeFromNRIC, getDoBFromNRIC } from 'common/utils/dateUtils'
import { isNumeric, isOdd } from 'common/utils/stringUtils'
import moment from 'moment'

export const convertExcelDataToRequestObj = (dataList, countryList, combinationData) => {
  try {
    console.log(dataList)
    let uploadResult = []
    dataList.forEach((data, i) => {
      const dataKeyArr = Object.keys(data)
      const dataValueArr = Object.values(data)
      let uploadedMember = {
        key: i,
        address: {
          streetName: '',
          city: '',
          state: '',
          postOffice: '',
          postalCode: '',
          country: 'MYS',
          addressLine1: '',
          addressLine2: '',
          addressLine3: '',
        },
        nric: '',
        nationality: 'MYS',
        name: '',
        email: '',
        mobileNumber: '',
        gender: '',
        dateOfBirth: null,
        pep: 'No',
        dependents: [],
        relationship: '',
        staffId: '',
        bankAccount: '',
        bankName: '',
        designation: '',
        joiningDate: '',
        healthQuestions: [],
        underwritingQuestion: false,
      }
      dataKeyArr?.forEach((element, index) => {
        const compareElement = element.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')

        if (compareElement.includes('employeesdesignation')) {
          uploadedMember.designation = dataValueArr[index]
        }
        if (compareElement.includes('pep') || compareElement.includes('doyou')) {
          uploadedMember.pep = dataValueArr[index]
        }
        if (compareElement.includes('nationality')) {
          uploadedMember.nationality = countryList?.find((item) => item.country_Nm.toLowerCase() === dataValueArr[index].toLowerCase()).isO_Cd
          uploadedMember.citizen = uploadedMember.nationality === 'MYS' ? 'MYS' : 'NonMYS'
          if (uploadedMember.citizen === 'MYS') {
            uploadedMember.nric = uploadedMember.nric
            uploadedMember.passport = ''
          } else {
            uploadedMember.passport = uploadedMember.nric
            uploadedMember.nric = ''
          }
        }
        if (compareElement.includes('nric')) {
          uploadedMember.nric = dataValueArr[index]
        }
        if (compareElement.includes('memberresidential/correspondenceaddress')) {
          const addressObj = getAddressObjectFromString(dataValueArr[index])
          uploadedMember.address.address1 = dataValueArr[index]
          uploadedMember.address.addressLine1 = addressObj.Address_Line1
          uploadedMember.address.addressLine2 = addressObj.Address_Line2
          uploadedMember.address.addressLine3 = addressObj.Address_Line3
          uploadedMember.address.street = addressObj.Address_Line1
          uploadedMember.address.city = addressObj.City_Nm
          uploadedMember.address.state = addressObj.State_Nm
          uploadedMember.address.postalCode = addressObj.Pin_Zip
          uploadedMember.address.country = addressObj.Country ?? 'Malaysia'
        }
        if (compareElement.includes('addressline1')) {
          uploadedMember.address.addressLine1 = dataValueArr[index]
        }
        if (compareElement.includes('addressline2')) {
          uploadedMember.address.addressLine2 = dataValueArr[index]
        }
        if (compareElement.includes('addressline3')) {
          uploadedMember.address.addressLine3 = dataValueArr[index]
        }
        if (compareElement.includes('postcode')) {
          uploadedMember.address.postalCode = dataValueArr[index]
        }
        if (compareElement.includes('state')) {
          uploadedMember.address.state = dataValueArr[index]
        }
        if (compareElement.includes('city')) {
          uploadedMember.address.city = dataValueArr[index]
        }
        if (compareElement.includes('country')) {
          uploadedMember.address.country = dataValueArr[index]
        }
        if (compareElement.includes('proposedmembername')) uploadedMember.name = dataValueArr[index]
        if (compareElement.includes('employeeemail')) uploadedMember.email = dataValueArr[index]
        if (compareElement.includes('employeemobileno')) {
          uploadedMember.mobileNumber = dataValueArr[index]?.substr(2)
          uploadedMember.mobileCountry = dataValueArr[index]?.substr(0, 2)
        }
        if (compareElement.includes('employeegender')) {
          uploadedMember.gender = dataValueArr[index]?.toLowerCase() === 'male' ? 'Male' : 'Female'
        }
        if (compareElement.includes('employeedob')) {
          uploadedMember.dateOfBirth = dataValueArr[index]
        }
        if (compareElement.includes('employeerank')) uploadedMember.rank = +dataValueArr[index]
        if (compareElement.includes('relationshipwithemployee')) uploadedMember.relationship = dataValueArr[index]
        if (compareElement.includes('employeeid')) uploadedMember.staffId = dataValueArr[index]
        if (compareElement.includes('bankaccount')) {
          if (isNumeric(uploadedMember.bankAccount)) {
            uploadedMember.bankAccount = +dataValueArr[index]
          } else {
            uploadedMember.bankAccount = dataValueArr[index]
          }
        }
        if (compareElement.includes('nameofbank')) uploadedMember.bankName = dataValueArr[index]
        if (compareElement.includes('joiningdate')) uploadedMember.joiningDate = dataValueArr[index]
      })
      if (uploadedMember.citizen === 'MYS') {
        uploadedMember.age = getAgeFromNRIC(uploadedMember.nric)
      } else {
        uploadedMember.age = getAgeFromDoB(uploadedMember.dateOfBirth)
      }
      if (uploadedMember.citizen === 'MYS') {
        uploadedMember.gender = isOdd(uploadedMember.nric?.slice(-1)) ? 'Male' : 'Female'
      }
      uploadResult.push(uploadedMember)
    })

    uploadResult = uploadResult.filter((f) => f.staffId)

    let uploadResultWError = CheckErrorInUploadedMembers(uploadResult, combinationData)

    uploadResultWError.forEach((element) => {
      if (element.relationship?.toLowerCase() !== 'employee') {
        let el = uploadResult.find((f) => f.staffId == element.staffId && f.relationship?.toLowerCase() === 'employee')
        if (el) {
          element.type = 'FAMILY'
          element.rank = el.rank
          element.fullname = element.name
          element.JoiningDate = el.joiningDate
          if (element.nationality?.toLowerCase() === 'mys') {
            element.dateOfBirth = getDoBFromNRIC(element.nric ?? '')
          }
          el.dependents.push(element)
        }
      }
    })

    // Filter employee result
    let employeeResult = uploadResultWError.filter((f) => f.relationship?.toLowerCase() == 'employee')
    // Apply UW question for each emp if amount emp in range (5, 10)
    if (employeeResult.length >= 5 && employeeResult.length <= 10) {
      employeeResult.forEach((element) => {
        element.underwritingQuestion = true
      })
    }

    return employeeResult
  } catch (error) {
    console.log(error)
  }
}

const getPlanFromPlanString = (planString) => {
  return planString.match(/\d+/).length > 0 ? 'Plan ' + planString.match(/\d+/)[0].padStart(3, '0') : null
}

const getAddressObjectFromString = (addressString) => {
  if (!addressString) {
    return null
  }
  let addressObj = {}
  const addressPart = addressString.split(', ')
  switch (addressPart.length) {
    case (1, 2, 4):
      break
    case 3:
      addressObj = {
        City_Nm: addressPart[1],
        Pin_Zip: addressPart[2].split(' ')[0],
        State_Nm: addressPart[2].split(' ')[1],
      }
      break
    case 5:
      addressObj = {
        City_Nm: addressPart[2],
        Pin_Zip: addressPart[3],
        State_Nm: addressPart[4],
      }
      break
    case 6:
      addressObj = {
        Address_Line3: addressPart[2],
        Mailing_Address3: addressPart[2],
        City_Nm: addressPart[3],
        Pin_Zip: addressPart[4],
        State_Nm: addressPart[5],
      }
      break
    default:
      addressObj = {
        Address_Line3: addressPart[2],
        Mailing_Address3: addressPart[2],
        City_Nm: addressPart[3],
        Pin_Zip: addressPart[4],
        State_Nm: addressPart[5],
        Country: addressPart[6],
      }
      break
  }
  addressObj.Address_Line1 = addressPart[0]
  addressObj.Address_Line2 = addressPart[1]
  addressObj.Mailing_Address1 = addressObj.Address_Line1
  addressObj.Mailing_Address2 = addressObj.Address_Line2
  addressObj.Mailing_City = addressObj.City_Nm
  addressObj.Mailing_Pin_Zip = addressObj.Pin_Zip
  addressObj.Mailing_State = addressObj.State_Nm

  return addressObj
}

export const CheckErrorInUploadedMembers = (membersData, rankList) => {
  const checkingCategory = {
    uniqueStaffID: membersData.filter((member) => member.relationship?.toLowerCase() === 'employee').map((v) => v.staffId),
    uniqueEmail: membersData.filter((member) => member.relationship?.toLowerCase() === 'employee').map((v) => v.email),
    uniqueNRIC: membersData.map((v) => v.nric),
    uniquePassport: membersData.map((v) => v.passport),
    nricRegex: new RegExp(REGEX.NRIC),
    nameRegex: new RegExp(REGEX.ALPHABET_NAME),
    emailRegex: new RegExp(REGEX.EMAIL),
    phoneRegex: new RegExp(/^(1)[02-46-9][0-9]{7,8}$|^(1)[1][0-9]{7,8}$/),
    digitRegex: new RegExp(REGEX.DIGIT_ONLY),
    relationshipArr: ['Spouse', 'Child', 'Employee'],
  }

  const newMembersData = []
  membersData.forEach((member) => {
    newMembersData.push(MemberErrorCheck(member, checkingCategory, rankList))
  })
  console.log('newMembersData', newMembersData)
  return newMembersData
}

const MemberErrorCheck = (member, checkingCategory, rankList) => {
  member.errorStatus = []
  const isEmployee = member.relationship?.toLowerCase() === 'employee'
  const isMalaysian = member.nationality?.toUpperCase() === 'MYS'
  if (isEmployee && checkingCategory?.uniqueStaffID.filter((item) => member.staffId && item === member.staffId)?.length > 1) {
    member.errorStatus.push({ field: 'staffId', error: MEMBER_ERRORS.DUPLICATE_STAFF_ID })
  }
  if (member.name && !checkingCategory?.nameRegex.test(member.name)) {
    member.errorStatus.push({ field: 'name', error: MEMBER_ERRORS.NAME_VALIDATION })
  }
  if (member.name && member.name.length > 50) {
    member.errorStatus.push({ field: 'name', error: MEMBER_ERRORS.NAME_LENGTH_VALIDATION })
  }
  if (!member.mobileNumber) {
    member.errorStatus.push({ field: 'mobileNumber', error: MEMBER_ERRORS.PHONE_MANDATORY })
  }
  if (member.mobileNumber && !checkingCategory?.phoneRegex.test(member.mobileNumber)) {
    member.errorStatus.push({ field: 'mobileNumber', error: MEMBER_ERRORS.PHONE_FORMAT })
  }
  if (!member.email) {
    member.errorStatus.push({ field: 'email', error: MEMBER_ERRORS.EMAIL_MANDATORY })
  }
  if (member.email && !checkingCategory?.emailRegex.test(member.email)) {
    member.errorStatus.push({ field: 'email', error: MEMBER_ERRORS.EMAIL_FORMAT })
  }
  if (isEmployee && checkingCategory?.uniqueEmail.filter((item) => member.email && item === member.email)?.length > 1) {
    member.errorStatus.push({ field: 'email', error: MEMBER_ERRORS.DUPLICATE_EMAIL })
  }
  if (member.bankAccount && !checkingCategory?.digitRegex.test(member.bankAccount)) {
    member.errorStatus.push({ field: 'bankAccount', error: MEMBER_ERRORS.BANK_ACCOUNT_DIGIT })
  }
  if (!checkingCategory?.relationshipArr.some((rela) => rela.toLowerCase() === member.relationship?.toLowerCase())) {
    member.errorStatus.push({ field: 'relationship', error: MEMBER_ERRORS.RELATIONSHIP_ENUM })
  }
  if (checkingCategory?.uniqueNRIC.filter((item) => member.nric && item === member.nric)?.length > 1) {
    member.errorStatus.push({ field: 'nric', error: MEMBER_ERRORS.DUPLICATE_NRIC })
  }
  if (member.nric && !checkingCategory?.nricRegex.test(member.nric)) {
    member.errorStatus.push({ field: 'nric', error: MEMBER_ERRORS.NRIC_FORMAT })
  }
  if (checkingCategory?.uniquePassport.filter((item) => member.passport && item === member.passport)?.length > 1) {
    member.errorStatus.push({ field: 'passport', error: MEMBER_ERRORS.DUPLICATE_PASSPORT })
  }
  if (member.relationship === 'Child' && ((member.age.year === 0 && member.age.month === 0 && member.age.day < 15) || member.age.year > 23)) {
    member.errorStatus.push({ field: isMalaysian ? 'nric' : 'dateOfBirth', error: MEMBER_ERRORS.AGE_VALUE })
  }
  if (member.relationship?.toLowerCase() === 'employee' || member.relationship?.toLowerCase() === 'spouse') {
    if (member.age.year < 17 || member.age.year > 65) {
      member.errorStatus.push({ field: isMalaysian ? 'nric' : 'dateOfBirth', error: MEMBER_ERRORS.AGE_VALUE })
    }
  }
  if (!isMalaysian) {
    if (!member.visaIssueDate) {
      member.errorStatus.push({ field: 'visaIssueDate', error: MEMBER_ERRORS.WORKING_PASSPORT_EXPIRY_DATE })
    }
    if (!member.visaExpiry) {
      member.errorStatus.push({ field: 'visaExpiry', error: MEMBER_ERRORS.WORKING_VISA_EXPIRY_DATE })
    }
    if (!member.documents?.some((d) => d.type === 'passport' && d.url)) {
      member.errorStatus.push({ field: 'passport_copy', error: MEMBER_ERRORS.PASSPORT_COPY })
    }
    if (!member.documents?.some((d) => d.type === 'visa' && d.url)) {
      member.errorStatus.push({ field: 'visa_copy', error: MEMBER_ERRORS.WORKING_PERMIT_COPY })
    }
    if (!member.dateOfBirth) {
      member.errorStatus.push({ field: 'dateOfBirth', error: MEMBER_ERRORS.DOB_MANDATORY })
    }
    if (!member.gender) {
      member.errorStatus.push({ field: 'gender', error: MEMBER_ERRORS.GENDER_MANDATORY })
    }
  }

  if (!rankList?.includes(+member.rank) && member.relationship?.toLowerCase() === 'employee') {
    member.rank = 1
    member.errorStatus.push({ field: 'rank', error: MEMBER_ERRORS.RANK_ERROR })
  }
  if (member.underwritingQuestion && (!member.healthQuestions?.length || member.healthQuestions?.some((s) => s.answer?.toLowerCase() !== 'no'))) {
    member.errorStatus.push({ field: 'healthQuestions', error: MEMBER_ERRORS.FAILED_UNDERWRITINGQUESTION })
  }

  if (member.pep?.toLowerCase() === 'yes' && !member?.pepDeclaration?.member) {
    member.errorStatus.push({ field: 'pepDeclaration', error: MEMBER_ERRORS.REQUIRE_PEP })
  }

  return member
}

export const FileErrorCheck = (data) => {
  let errors = []
  if (!data || data?.length == 0 || data?.every((item) => !item)) {
    errors.push('Sorry, No data detected, please upload again')
  }
  if (data?.length < 5 || data?.length > 250) {
    errors.push('Sorry, we could not proceed with your application because you have less than 5 employees or above 250')
  }
  return errors
}

export const GetRelationship = (relationship) => {
  switch (relationship.toLowerCase()) {
    case 'child':
      return 'R004'
    case 'employee':
    case 'self':
      return 'R001'
    case 'parent':
    case 'father':
      return 'R006'
    case 'mother':
      return 'R005'
    case 'son':
      return 'R002'
    case 'spouse':
      return 'R003'
    default:
      return ''
  }
}
