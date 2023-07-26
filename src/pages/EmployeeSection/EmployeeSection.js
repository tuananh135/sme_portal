import { Form } from "antd";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { FRIENDLY_MESSAGE, HEALTH_QUESTIONS } from "common/constants/constants";
import { getAgeFromNRIC } from "common/utils/dateUtils";
import PoliticallyExpose from "pages/DirectorDetail/PoliticallyExpose";
import HealthQuestion from "pages/HealthQuestion/HealthQuestion";
import PersonalDetail from "pages/PersonDetail/component/PersonDetail";
import PersonDetailInfo from "pages/PersonDetail/component/PersonDetailInfo";
import PersonalPEP from "pages/PersonDetail/component/PoliticallyExpose";
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";
import { PersonService } from "services/B2CService/PersonService";
import styled from "styled-components";
import FinalPage from "./components/FinalPage";
import PersonalInformationTerms from "./components/PersonalInformationTerms";
import { NotificationDispatchContext } from "contexts/NotificationContext";
import moment from "moment";
import { UWStatus, checkHealthQuestionsPassed } from "common/utils/healthQuestionUtil";
import _ from "lodash";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

function EmployeeSection() {
  const params = useParams();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [needUWQuestion, setNeedUWQuestion] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { updateNotification } = useContext(NotificationDispatchContext);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    getPersonInfo();
    getUWInfo();
  }, []);

  const getPersonInfo = async () => {
    let info = await PersonService.GetPersonById(searchParams.get("empId"));
    if (!info) return;

    info.citizen = info.nationality === "MYS" ? "MYS" : "NonMYS";
    info.dateOfBirth_display = info.dateOfBirth ? moment(info.dateOfBirth, "DD/MM/YYYY") : null;
    info.visaExpiry_display = info.visaExpiry ? moment(info.visaExpiry) : null;
    info.visaIssueDate_display = info.visaIssueDate ? moment(info.visaIssueDate) : null;
    info?.dependents.forEach(d => {
      d.noDependent = info?.dependents?.length
      d.citizen = d.nationality === "MYS" ? "MYS" : "NonMYS";
      d.dateOfBirth_display = d.dateOfBirth ? moment(d.dateOfBirth) : null;
      d.visaExpiry_display = d.visaExpiry ? moment(d.visaExpiry) : null;
      d.visaIssueDate_display = d.visaIssueDate ? moment(d.visaIssueDate) : null;
    });
    form.setFieldsValue({
      ...info,
      remember: true,
      healthQuestions: HEALTH_QUESTIONS,
      dependents: info?.dependents.length > 0 ? info?.dependents : [{ noDependent: 0 }],
      documents: info?.documents.length > 0 ? info.documents : [{ type: "passport" }, { type: "visa" }, { type: "visaCopy" }],
    });
  };

  const getUWInfo = async () => {
    const UWStatus = await EmployeeGroupService.CheckUWQuestion(id);
    if (UWStatus.status === 200 && UWStatus.data) {
      setNeedUWQuestion(true);
      return;
    }
    setNeedUWQuestion(false);
  };

  const onNext = () => {
    const pep = form.getFieldValue("pep")?.toLowerCase();
    const nric = form.getFieldValue("nric");

    if (needUWQuestion || getAgeFromNRIC(nric) > 65) {
      if (currentStep === 0) {
        if (pep === "no") {
          setCurrentStep((prev) => prev + 2);
          return;
        }
      }
    } else {
      if (currentStep === 0) {
        if (pep === "no") {
          setCurrentStep((prev) => prev + 3);
          return;
        }
      }
      if (currentStep === 1) {
        setCurrentStep((prev) => prev + 2);
        return;
      }
    }
    const newStep =
      currentStep === steps.length - 1 ? currentStep : currentStep + 1;
    setCurrentStep(newStep);
  };

  const onBack = () => {
    const pep = form.getFieldValue("pep").toLowerCase();
    if (pep === "no") {
      setCurrentStep((prev) => prev - 2);
    }
    else {
      setCurrentStep((prev) => prev - 1);
    }

  }

  const onPEPBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      let data = form.getFieldsValue(true);
      if (needUWQuestion) {
        const result = checkHealthQuestionsPassed(data);
        if (result != UWStatus.PASSED) {
          updateNotification([
            {
              id: Math.random(),
              message: FRIENDLY_MESSAGE[result],
              types: "error",
            },
          ]);
          return;
        }
      }
      if (data?.healthQuestions?.length) {
        if (data.healthQuestions.some(s => !s.answer)) {
          data.healthQuestions = [];
        }
      }
      if (data.dependents?.length && data.dependents[0].noDependent == 0) {
        data.dependents = [];
      }
      data = {
        ...data,
        groupId: id,
        id: searchParams.get("empId"),
        type: "EMPLOYEE",
        relationship: "employee",
        status: 1,
        nationality: data.citizen === "MYS" ? "MYS": data.nationality
      };
      const result = await EmployeeGroupService.PutPersonDetails(data);
      if (result.data && result.status === 200) {
        setCurrentStep((prev) => prev + 1);
      }
      else {
        updateNotification([
          {
            id: Math.random(),
            message: <div dangerouslySetInnerHTML={{ __html: result?.data?.message }}></div>,
            types: "error",
          },
        ]);
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const onReset = () => {
    setCurrentStep(0);
  };

  const onFieldChange = (event) => {
    // Event when click change pep involve
    const name = _.get(event[0], "name[0]", null);
    if (name == "personInvolve") {
      const personInvolve = _.get(event[0], "value", "").toLowerCase();
      const pep = form.getFieldValue(["pepDeclaration"])
      if (!pep) {
        form.setFieldValue("pepDeclaration",
          {
            member: personInvolve.includes("myself") ? {
              name: form.getFieldValue("name"),
              nric: form.getFieldValue("nric")
            } : null,
            family: personInvolve.includes("familymember") ? [{}] : []
          });
      }
      else {
        if (personInvolve.includes("myself") && !pep.member) {
          form.setFieldValue("pepDeclaration", {
            ...pep, member: {
              name: form.getFieldValue("name"),
              nric: form.getFieldValue("nric")
            }
          })
        }
        if (personInvolve.includes("familymember") && (!pep.family || !pep.family.length)) {
          form.setFieldValue("pepDeclaration", {
            ...pep, family: [{}]
          })
        }
      }
    }
  }

  const hasDuplicateFields = async(field, value) => {
    return await PersonService.CheckEmployeeNotExist(value, field, id)
}

  const steps = [
    {
      component: <PersonalDetail form={form} empData={form.getFieldsValue(true)} onEditEmp={onNext} onNext={onNext} hasDuplicateFields={hasDuplicateFields}/>,
    },
    { component: <PersonalPEP form={form} onNext={onNext} onBack={onPEPBack} /> },
    {
      component: <HealthQuestion form={form} onNext={onNext} onBack={onBack} />,
    },
    {
      component: (
        <PersonDetailInfo
          data={form.getFieldsValue(true)}
          onEdit={onReset}
          onSave={onSubmit}
          isSubmitting={isSubmitting}
        />
      ),
    },
    // {
    //   component: <PersonalInformationTerms onNext={onSubmit} />,
    // },
    {
      component: <FinalPage />,
    },
  ];

  return (
    <>
      {isLoading ? (
        <div
          className="text-white center-items text-bold text-xxx-large d-flex-c"
          style={{ marginTop: "15vh" }}
        >
          <ChatIcon smallIcon={false} width={100} className="mb-5" />
          <div>HELLO!</div>
          <div>Welcome to TUNE PROTECT!</div>
          <div>{searchParams.get("email")}</div>
        </div>
      ) : (
        <Wrapper>
          <Form
            name="basic"
            onFieldsChange={onFieldChange}
            initialValues={{
              dependents: [],
              remember: true,
              healthQuestions: HEALTH_QUESTIONS,
              documents: [{ type: "passport" }, { type: "visa" }, { type: "visaCopy" }],
            }}
            size="small"
            onFinish={onNext}
            form={form}
            labelCol={{ span: 24 }}
            className="person-detail-form max-width-input d-flex-c center-items"
            autoComplete="off"
          >
            {steps[currentStep]?.component}
          </Form>
        </Wrapper>
      )}
    </>
  );
}

export default EmployeeSection;
