import React, { Fragment, useEffect, useState, useContext } from "react";
import { Form, Modal } from "antd";
import DirectorDetail from "./DirectorDetail";
import DirectorBriefInfo from "./DirectorBriefInfo";
import PoliticallyExpose from "./PoliticallyExpose";
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";
import { useParams } from "react-router-dom";
import { NotificationDispatchContext } from "contexts/NotificationContext";
import { DocumentService } from "services/B2CService/DocumentService";
import { getDoBFromNRIC } from "common/utils/dateUtils";
import _ from "lodash";

function get_url_extension( url ) {
  return url?.split(/[#?]/)[0]?.split('.')?.pop()?.trim();
}

function DirectorDetailModal({ show, setShow, onSubmit, directorsInfo }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const { updateNotification } = useContext(NotificationDispatchContext);
  const [doc, setDoc] = useState([
    {
      type: "ssm",
      base64: "",
      fileExtension: "",
      fileName: "",
      employeeGroupId: id
    },
    {
      type: "form9",
      base64: "",
      fileExtension: "",
      fileName: "",
      employeeGroupId: id
    },
    {
      type: "form24",
      base64: "",
      fileExtension: "",
      fileName: "",
      employeeGroupId: id
    },
    {
      type: "form49",
      base64: "",
      fileExtension: "",
      fileName: "",
      employeeGroupId: id
    },
    {
      type: "form13",
      base64: "",
      fileExtension: "",
      fileName: "",
      employeeGroupId: id
    },
    {
      type: "letter",
      base64: "",
      fileExtension: "",
      fileName: "",
      employeeGroupId: id
    },
  ])
  const [isDefaultComplete, setDefaultComplete] = useState(false);
  const [documentsUploaded, setIsDocumentsUpload] = useState({
    form9: {
      Status: false,
    },
    form24: {
      Status: false,
    },
    form49: {
      Status: false,
    },
    form13: {
      Status: false,
    },
    ssm: {
      Status: false,
    },
  });

  const hideModal = () => {
    setShow(false);
    setCurrentStep(0);
  };

  const onNext = () => {
    console.log(form.getFieldsValue(true));
    const directorsDetail = form.getFieldValue("directors");
    if (currentStep === 0 && directorsDetail.every(item=> item.pep === "No")) {
      setCurrentStep(2);
      return;
    }
    setCurrentStep((prev) => (prev === steps.length - 1 ? prev : prev + 1));
  };

  const onReset = () => {
    setCurrentStep(0);
  };

  const steps = [
    {
      component: <DirectorDetail form={form} onSubmit={onNext} groupId={id} documentsUploadedPros={documentsUploaded} isDefaultComplete={isDefaultComplete}/>,
    },
    { component: <PoliticallyExpose form={form} onNext={onNext} /> },
    {
      component: (
        <DirectorBriefInfo form={form} onEdit={onReset} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
      ),
    },
  ];

  const InitialValue = {
    remember: true,
    directors: [
      {
        groupID: id,
        name: "",
        nric: "",
        nationality: "",
        dateOfBirth: "",
        email: "",
        role: "",
        orgName: "",
        position: "",
        positionYears: 0,
        mobileNumber: "",
        mobileCountry: "",
        rank: 0,
        gender: "",
        bankAccount: "",
        bankName: "",
        pep: "",
        type: "DIRECTOR",
        status: 0,
        address: {},
        dependents: [],
        healthQuestions: [],
      },
    ],
    documents: doc,
  };

  useEffect(() => {
    if (directorsInfo?.length>0) {
      directorsInfo.forEach(director => {
        if (director.role || director.orgName || director.position) {
          director.pep = "Yes";
        }
      });
      form.setFieldsValue({...InitialValue, directors:directorsInfo});
      return;
    }
    form.setFieldsValue(InitialValue);
  }, [directorsInfo])
  
  useEffect(() => {
    getDocuments();
  }, [])
  

  const getDocuments = async()=>{
    // var filetype =["ssm","form9","form24","form49","form13","letter"]
    var filetype =["ssm","form24","form49","form13","letter"]
    var result = await DocumentService.GetDocumentByGroup(id);
    if (result?.data?.length >0) {
      var docData = filetype.map(item => {
        var doc = result?.data?.find(data => data.type === item);
        var extension = "application/" + get_url_extension(doc?.data);
        if (doc) {
          setIsDocumentsUpload(prev => {
            prev[item] = { Status: true }
            return prev;
          })
        }
        return {
          type: item,
          base64: doc?.url,
          fileExtension: doc?.fileExtension ?? extension,
          fileName: doc?.data,
          employeeGroupId: id
      }});
      form.setFieldValue("documents", docData);
      setDoc(docData);
      if (documentsUploaded?.ssm?.Status) {
        setDefaultComplete(true);
      } else if (
        documentsUploaded?.form9?.Status &&
        documentsUploaded?.form13?.Status &&
        documentsUploaded?.form24?.Status &&
        documentsUploaded?.form49?.Status
      ) {
        setDefaultComplete(true);
      }
    }
   
  }

  const submitForm = async () => {
    try {
      setIsSubmitting(true);
      const formData = form.getFieldsValue(true);
      const directorData = formData?.directors?.map((item) => {
        return { ...item, groupId: id, type: "DIRECTOR", dateOfBirth: getDoBFromNRIC(item.nric), nationality: "MYS" };
      });
      const documentData = formData?.documents?.filter(f => f.fileName).map((item) => {
        return { ...item, groupId: id };
      });
      const data = {
        directors: directorData,
        documents: documentData,
      };
      const result = await EmployeeGroupService.PostPersonWithMemberDetails(data);
      if (result) {
        if (result?.data?.code && result?.data?.code !== 200) {
          updateNotification([
            {
              id: Math.random(),
              message: <div dangerouslySetInnerHTML={{__html: result?.data?.message}}></div>,
              types: "error",
            },
          ]);
        } 
        else
        {
          await EmployeeGroupService.AgreeVerifyByCTO(id);
          hideModal();
          onSubmit();
        }  
      }
    } catch (error) {
      
    }
    finally{
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (event) => {
    // Event when click change pep involve
    const name = _.get(event[0], "name[2]", null);
    if (name == "personInvolve") {
      const personInvolve = _.get(event[0], "value", "").toLowerCase();
      const index = _.get(event[0], "name[1]", 0)
      const pep = form.getFieldValue(["directors", index, "pepDeclaration"])
      if (!pep) {
        form.setFieldValue(["directors", index, "pepDeclaration"],
          {
            member: personInvolve.includes("myself") ? {
              name: form.getFieldValue(["directors", index, "name"]),
              nric: form.getFieldValue(["directors", index, "nric"])
            } : null,
            family: personInvolve.includes("familymember") ? [{}] : []
          });
      }
      else {
        if (personInvolve.includes("myself") && !pep.member) {
          form.setFieldValue(["directors", index, "pepDeclaration"], {
            ...pep, member: {
              name: form.getFieldValue("name"),
              nric: form.getFieldValue("nric")
            }
          })
        }
        if (personInvolve.includes("familymember") && (!pep.family || !pep.family.length)) {
          form.setFieldValue(["directors", index, "pepDeclaration"], {
            ...pep, family: [{}]
          })
        }
      }
    }
  };

  return (
    <Modal
      open={show}
      onOk={hideModal}
      onCancel={hideModal}
      okText="Ok"
      cancelText="Cancel"
      className="director-info text-white d-flex"
      footer={null}
    >
      <Form
        name="basic"
        initialValues={InitialValue}
        size="small"
        form={form}
        onFinish={submitForm}
        onFieldsChange={handleFormChange}
        id="director-form"
        autoComplete="off"
      >
        {steps[currentStep]?.component}
      </Form>
    </Modal>
  );
}

export default DirectorDetailModal;
