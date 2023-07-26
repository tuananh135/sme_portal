import { Button } from "antd";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { closeCurrentTab } from "common/utils/browserUtils";
import { NotificationDispatchContext } from "contexts/NotificationContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";
import styled from "styled-components";
import { AUTHORISATION_STATUS } from "common/constants/constants";

const ButtonWrapper = styled.div`
  justify-content: space-between;
`;

const Wrapper = styled.div`
  margin: 0 auto;
`;

function DirectorAuthorisation() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [action, setAction] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [employeeGroupDetail, setemployeeGroupDetail] = useState(null);
  const { updateNotification } = useContext(NotificationDispatchContext);

  const getAuthorisationInfo = async () => {
    var data = await EmployeeGroupService.GetAuthorisationInfo(id);
    if (data) setInfo(data);
  };

  useEffect(() => {
    getAuthorisationInfo();
    setGroupId(atob(id)?.split(';')?.at(0));
  }, []);

  useEffect(() => {
    if (groupId) Promise.all([fetchEmployeeGroup()]);
  }, [groupId]);

  const onAgree = async() =>{
    const result = await EmployeeGroupService.UpdateAuthorisationStatus(groupId, AUTHORISATION_STATUS.APPROVED,info?.directorEmail,info?.directorName);
    if (result) {
      setAction("ACCEPT");
      return;
    }
    updateNotification([
      {
        id: Math.random(),
        message: <div className="d-flex">
          <div>
            Error during execution!
          </div>
        </div>,
        types: "error",
      },
    ]);
  }
   
  const fetchEmployeeGroup = async () => {
    var currentEmployeeGroup = await EmployeeGroupService.GetEmployeeGroupByID(groupId);
    if (currentEmployeeGroup?.data)
      setemployeeGroupDetail(currentEmployeeGroup.data);
  }

  const onDisagree = async() =>{
    const result = await EmployeeGroupService.UpdateAuthorisationStatus(groupId, AUTHORISATION_STATUS.DECLINED,info?.directorEmail,info?.directorName);
    if (result) {
      setAction("NOT-ACCEPT");
      return;
    }
    updateNotification([
      {
        id: Math.random(),
        message: <div className="d-flex">
          <div>
            Error during execution!
          </div>
        </div>,
        types: "error",
      },
    ]);
  }

  const getAcceptContent = () => {
    return (
      <>
        <div className="mt-3 mb-3 text-x-large">
          <b>Thank you</b>
        </div>
        <div className="text-small">
          Copy of Authorisation letter will be sent to you and the rest of the
          directors
        </div>
        <ButtonWrapper className="d-flex-c w-100 center-items-y mt-5">
          <Button
            className="TunePrimaryButton text-width w-70 text-white mb-5"
            style={{ minWidth: "100px" }}
            onClick={()=>closeCurrentTab()}
          >
            Close
          </Button>
        </ButtonWrapper>
      </>
    );
  };

  const getVerifyingContent = () => {
    return (
      <>
        <div className="mt-3 mb-3 text-x-large">
          <b>Thank you</b>
        </div>
        <div className="text-small">
          Copy of Authorisation letter will be sent to you and the rest of the
          directors.
          <p>Status Pending Approval.</p>
        </div>
        <ButtonWrapper className="d-flex-c w-100 center-items-y mt-5">
          <Button
            className="TunePrimaryButton text-width w-70 text-white mb-5"
            style={{ minWidth: "100px" }}
            onClick={()=>closeCurrentTab()}
          >
            Close
          </Button>
        </ButtonWrapper>
      </>
    );
  };

  const getNotAcceptContent = () => {
    return (
      <>
        <div className="mt-3 mb-3 text-x-large">
          <b>Oops!</b>
        </div>
        <div className="text-small">
          The authorisation has been declined.<br></br> Your application will
          not go through and if you need any assistance please contact our
          customer service.
        </div>
        <ButtonWrapper className="d-flex-c w-100 center-items-y mt-5">
          <Button
            className="TunePrimaryButton text-width w-70 text-white mb-5"
            style={{ minWidth: "100px" }}
            onClick={()=>closeCurrentTab()}
          >
            Close
          </Button>
        </ButtonWrapper>
      </>
    );
  };

  const getMainContent = () => {
    return (
      <>
        <div className="mt-3 mb-3 text-x-large">
          <b>Hello, {info?.directorName},</b>
        </div>
        <div className="text-small">
          {"Your staff "}
          <b>
            {info?.hrName} (NRIC : {info?.hrNRIC})
          </b>
          {
            " has asked for your authorization to purchase Tune Protect SME EZY for "
          }
          {info?.companyName}.
        </div>
        <div className="mt-3 mb-3 text-small">
          Do you agree to authorise{" "}
          <b>
            {info?.hrName} (NRIC : {info?.hrNRIC})
          </b>{" "}
          as the key person in charge to purchase Tune Protect SME EZY and to
          liaise with Tune Protect Ventures Sdn Bhd regarding all insurance
          matters on behalf of <b>{info?.CompanyName}</b>?
        </div>
        <ButtonWrapper className="d-flex-c w-100 center-items-y">
          <Button
            className="TunePrimaryButton text-width w-70 text-white mb-5"
            style={{ minWidth: "100px" }}
            onClick={onAgree}
          >
            Yes, Agree & Approve
          </Button>
          <Button
            className="full-width-button w-70 mb-5 TuneTransparentButton"
            onClick={onDisagree}
          >
            No, Decline
          </Button>
        </ButtonWrapper>
      </>
    );
  };

  return (
    <Wrapper className="d-flex-c text-white center-items text-center w-90">
      <ChatIcon />
      { (employeeGroupDetail?.authorisationStatus === AUTHORISATION_STATUS.APPROVED || action === "ACCEPT")
        ? getAcceptContent()
        : (employeeGroupDetail?.authorisationStatus === AUTHORISATION_STATUS.DECLINED || action === "NOT-ACCEPT")
        ? getNotAcceptContent()
        : (employeeGroupDetail?.authorisationStatus === AUTHORISATION_STATUS.VERIFY)
        ? getMainContent()
        : getVerifyingContent()
      }
    </Wrapper>
  );
}

export default DirectorAuthorisation;
