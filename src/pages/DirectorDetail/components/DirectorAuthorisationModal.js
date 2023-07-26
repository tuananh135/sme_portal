import PrimaryButton from "common/components/Button/PrimaryButton";
import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as IconAuthorisation } from "assets/images/icon-authorisation.svg";
import { ReactComponent as IconEmailSent } from "assets/images/icon-authorisation-request.svg";
import { Form, Modal, Radio, Select, Upload, notification } from "antd";
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";
import { EmpGroupDispatchContext, EmpGroupStateContext } from "contexts/EmpGroupContext";
import { AUTHORISATION_STATUS } from "common/constants/constants";

function DirectorAuthorisationModal({ show, setShow, getUploadProps, directorInfo }) {
  const [showDirectorInfo, setShowDirectorInfo] = useState(false);
  const [isSentEmail, setIsSentEmail] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const { empGroupID, empGroupData } = useContext(EmpGroupStateContext);

  const hideModal = () => {
    setShowDirectorInfo(false);
    setIsSentEmail(false);
    setShow(false);
    setSelectedDirector(null);
  };

  useEffect(() => {
    return () => {
      setShowDirectorInfo(false);
    };
  }, []);

  const sendEmailToDirectors = async()=>{
    let result = await EmployeeGroupService.UpdateAuthorisationStatus(empGroupID, AUTHORISATION_STATUS.VERIFYING, selectedDirector[0]?.email, null);
    if (!result) {
      notification.error({
        message: 'The approval status could not be updated.',
      });
      return;
    }
    const data = await EmployeeGroupService.SendEmailToDirector(empGroupID, empGroupData, selectedDirector);
    if (data) {
      setIsSentEmail(true);
    }
  }

  const getAuthRequestSentComponent = () => {
    return (
      <>
        <IconEmailSent />
        <div className="mt-3 text-bold text-center">
          Authorisation Request has been sent to your director
        </div>
        <div className="mt-3 text-center">
          You will be notified via email once your director has successfully
          approved your authorization request
        </div>
        <PrimaryButton
          style={{ alignSelf: "center" }}
          rootclass="w-90 full-width-button mt-3"
          text={"OK"}
          onClick={hideModal}
        />
      </>
    );
  };

  return (
    <Modal
      open={show}
      onOk={hideModal}
      onCancel={hideModal}
      okText="Ok"
      cancelText="Cancel"
      className="director-auth w-80 d-flex-c center-items max-width-input"
      footer={null}
    >
      {isSentEmail ? (
        getAuthRequestSentComponent()
      ) : (
        <>
          <IconAuthorisation />
          <div className="mt-3 text-bold">
            Getting your director's authorisation
          </div>
          {showDirectorInfo ? (
            <div className="w-90 text-center d-flex-c">
              <div className="mt-3">
                You must obtain consent/ authorisation from one of your directors that you are purchasing the SME EZY insurance on behalf of the company. Director will be notified via email and will be required to give authorisation digitally.
              </div>
              {/* <div className="mt-3 text-bold">
                Please select one of the directors below for authorisation
                purpose
              </div> */}
              <Radio.Group
                style={{ alignSelf: "flex-start", display: "block" }}
                onChange={(e)=> setSelectedDirector(directorInfo.filter(i => i.email === e.target.value))}
              >
                {
                  directorInfo?.map((director,index) => director?.name && <Radio
                    className="text-small red-radio mb-2"
                    style={{ display: "block" }}
                    value={director.email}
                    key={index}
                  >
                    {director.name}
                  </Radio>)
                }
              </Radio.Group>
              <PrimaryButton
                style={{ alignSelf: "center" }}
                rootclass="w-90 full-width-button mt-3"
                text={"Ask for approval"}
                onClick={sendEmailToDirectors}
                disabled = {!selectedDirector}
              />
            </div>
          ) : (
            <>
              <PrimaryButton
                disabled
                rootclass="w-95 full-width-button mb-3 mt-3"
                text={" Online Authorisation (coming soon)"}
                onClick={() => setShowDirectorInfo(true)}
              />
              <Upload {...getUploadProps("letter", 4)} on>
                <PrimaryButton
                  rootclass="w-95 full-width-button w-270px"
                  text={"Upload Letter of Authorisation"}
                />
              </Upload>
            </>
          )}
        </>
      )}
    </Modal>
  );
}

export default DirectorAuthorisationModal;
