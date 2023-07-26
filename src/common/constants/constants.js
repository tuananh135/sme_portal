
import { PAGE_LINK } from "./pagelinks";

export const EMPLOYEE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const REGEX = {
  PHONE_NUMBER: /^1\d{0,9}$/,
  NRIC: /^(0[0-9]|[1-9][0-9])(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])-(..)-([0-9]{4})$/,
  // EMAIL: /^[_A-Za-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*$/,
  EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  DIGIT_ONLY: /^[0-9]*$/,
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  ALPHABET: /^[a-zA-Z ]*$/,
  ALPHABET_DIGIT: /^[a-zA-Z0-9]*$/,
  BUSSINESS_NAME: /^[0-9a-zA-Z. ()]+$/,
  ALPHABET_DIGIT_HYPHEN: /^[a-zA-Z0-9-]*$/,
  ALPHABET_DIGIT_SPECIAL: /^[a-zA-Z0-9()<>@&/ .,-]*$/,
  ALPHABET_NAME: /^[a-zA-Z@,-/' ]*$/,
  ALPHABET_MAX: /^.{1,50}$/,
};

export const FILE_TYPE = {
  CSV_XLSX: [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ],
  DIRECTOR_DOCUMENT: [
    "image/jpeg",
    "image/png",
    "image/jpeg",
    "application/pdf",
  ],
  IMAGE: [
    "image/jpeg",
    "image/png",
    "image/jpeg"
  ],
  VIDEO: [
    "video/mp4",
    "video/webm",
    "video/*"
  ]
};
export const IMPORT_RESULT_RECORD_PER_PAGE = 15;
export const DATE_FORMAT = "DD/MM/YYYY";
export const apiUrl =
  process.env.NODE_ENV !== "production" ? "https://localhost:44390/api" : "";
export const API_VENDOR = "enoviq";
export const GENDER_CATEGORY = [
  {
    label: "Male",
    value: "M",
  },
  {
    label: "Female",
    value: "F",
  },
];
export const CLAIM_STATUS = {
  "New Claim": "PENDING",
  Close: "APPROVED",
  Bills: "REVIEW",
  Reccomended: "REJECT",
  Document: "DRAFT",
};
export const KYC_STATUS = {
  APPROVED: "APPROVED",
  VERIFY: "VERIFY",
};
export const AUTHORISATION_STATUS = {
  APPROVED: "APPROVED",
  VERIFY: "VERIFY",
  VERIFYING: "VERIFYING",
  DECLINED: "DECLINED",
};
export const CLAIM_STATUS_COLOR = {
  PENDING: "purple",
  REJECT: "red",
  APPROVED: "lime",
  REVIEW: "gold",
  DRAFT: "default",
};
export const ENTITY_TYPE = {
  Company: "Company",
};
export const KYC_AUTO_REDIRECT_SUCCESS_PAGE = {
  REDIRECT: 1,
  NO_REDIRECT: 0,
};

export const USER_ROLE = {
  ADMIN: "ADMIN",
  BROKER: "BROKER",
  MANAGER: "MANAGER",
  HUMAN_RESOURCE: "HUMAN RESOURCE",
  TEMPORARY_USER: "TEMPORARY USER",
};

export const HEALTH_QUESTIONS = [
  {
    title: "Question 1/3",
    desc: "Do you currently suffer from, or have ever been diagnosed with cancer, growth/tumor, chest pain, heart attack, stroke, high blood pressure, diabetes, Hepatitis B or C, HIV infection, mental disorders, drug or alcohol abuse, any disease/disorder of eyes, ears, nose, throat, oral cavity, skin, bone, spine, joint, blood vessels, congenital conditions, any physical disability or any condition of the heart, lungs, liver, kidneys, respiratory system, genitourinary system, digestive system, endocrine system or nervous system?",
    questionCd: "Q001"
  },
  {
    title: "Question 2/3",
    desc: "In the last 2 years, have you ever been hospitalized (except for giving birth), undergone any surgical operation, consulted a specialist or had an abnormal result from a medical investigation or diagnostic test or been advised to have any of these in the future, or are you currently planning or been advised, to consult a doctor or undergoing investigation or awaiting the results of medical tests or follow up?",
    questionCd: "Q002"
  },
  {
    title: "Question 3/3",
    desc: "Have any of your applications for insurance/takaful coverage, including renewal or reinstatement, ever been declined, postponed, rated up or accepted on special terms by any insurance company/takaful operator?",
    questionCd: "Q003"
  }
];

export const FRIENDLY_MESSAGE = {
  REJECT_BY_UNDERWRITING_RULE: "We apologise that we are unable to proceed with your application for this particular employee. You may proceed without this employee.",
  REJECT_BY_GENERAL_BLOCK: "We apologise that we are unable to proceed with your application. Contact us for further assistance",
  EMPLOYEE_FAILED: "We apologise that we are unable to proceed with your application for this particular employee. You may proceed without this employee.",
  DEPENDENT_FAILED: "We apologise that we are unable to proceed with your application for this particular dependent. You may proceed without this dependent."
}

export const RolePep = {
  MySelf: "Insured Member",
  MySelfFamilyMemberOnly: "Insured Member",
  FamilyMemberOnly: "Close associates",
  Default: "Insured Member",
  Others: "Close Associate",
  Child: "Family Member",
  Spouse: "Family Member"
}

export const PROGRESS_STEPS = {
  SELECT_PLAN: { TITLE: "Select Plan", PATH: [PAGE_LINK.BUDGET_OFFER.NAME]},
  BUSSINESS_DETAILS: { TITLE: "Business Details", PATH: [PAGE_LINK.BUSINESS_DETAIL.NAME]},
  VERIFYCATION: { TITLE: "Verification", PATH: [PAGE_LINK.IDENTITY_VERIFICATION.NAME]},
  EMPLOYEE_AND_DIRECTOR_DETAILS: { 
    TITLE: "Employee & Director Details", 
    PATH: [PAGE_LINK.UPLOAD_FILE_RESULT.NAME, PAGE_LINK.UPLOAD_FILE.NAME, PAGE_LINK.SELF_COMPLETE_EMP_RESULT.NAME, PAGE_LINK.EMPLOYEE_PROVIDER.NAME, PAGE_LINK.SELF_COMPLETE_EMP.NAME]},
  TERMS_AND_CONDITIONS: { TITLE: "Terms & Conditions", PATH: [PAGE_LINK.TERM_CONFIRMATION.NAME, PAGE_LINK.TERM_AND_CONDITION.NAME]},
  PAYMENT: { TITLE: "Payment", PATH: [PAGE_LINK.PAYMENT_TYPE.NAME]}
}