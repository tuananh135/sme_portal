import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Checkbox,
  Image,
  Upload,
  Row,
  Col,
} from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import upload from "assets/images/icon-camera.svg";
import { ReactComponent as PeopleIcon } from "assets/images/icon-people.svg";
import { ReactComponent as TickIcon } from "assets/images/icon-tick.svg";
import { PAGE_LINK } from "common/constants/pagelinks";
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";
import { BudgetService } from "services/B2CService/BudgetService";
import { gtl_GetAnnualLimitValue,ghs_GetAnnualLimitValue, sp_GetAnnualLimitValue} from "common/constants/budgetConstant";
import { PersonService } from "services/B2CService/PersonService";

const FormCard = styled.div``;

const FormCardHeader = styled.div`
  background-color: #ec5a54;
  color: #fff;
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px;
  border: 1px solid #ec5a54;
`;

const FormCardBody = styled.div`
  background-color: #3a3a3a;
  padding: 15px;
  color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border: 1px solid #ec5a54;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const PageText = styled.div`
  justify-content: center;
  color: white;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const FormContainer = styled.div`
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 100px;
  max-width: 600px;
`;
const GroupHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
`;

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    console.log("info", info);
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      // message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      // message.error(`${info.file.name} file upload failed.`);
    }
  },
};

function PurchaseSummary({ employee, combiData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [combinationData, setCombinationData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCombiByGroup();
  }, []);

  const getCombiByGroup = async () => {
    const result = await BudgetService.GetCombiByEmpGroup(id);
    if (result.data?.length > 0) {
      setCombinationData(result.data.sort((a, b) => {if ( a.rank < b.rank ){
        return -1;
      }
      if ( a.rank > b.rank ){
        return 1;
      }
      return 0;}));
    }
  };

  const onSendEmail = async () => {
    try {
      setIsSubmitting(true);
      const result = await PersonService.DeletePersonByGroupId(id);
      if (!result) {
        return;
      }
      const rs = await EmployeeGroupService.SendInvitationToEmployee(
        location?.state?.emails,
        id
      );
      if (rs) {
        navigate(PAGE_LINK.QR_CONFIRMATION.NAME + "/" + id);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <ChatIcon />
      <PageText className="text-large text-center">
        You're almost done!
        <br />
        Please review your plan before proceed
      </PageText>
      <FormContainer>
        <FormCard>
          <FormCardHeader className="text-large">
            Purchase Summary
          </FormCardHeader>
          <FormCardBody>
            {combinationData
              ?.filter(
                (data) =>
                  location?.state?.emails?.filter(
                    (item) => item.rank === data.rank
                  ).length > 0
              )
              .map((data, index) => (
                <div key={index} className="mb-3">
                  <Row gutter={6}>
                    <Col xs={6} md={3}>
                      <PeopleIcon
                        style={{ width: 14, verticalAlign: "middle" }}
                      ></PeopleIcon>
                      <span className="text-small ml-2">
                        X{" "}
                        {
                          location?.state?.emails?.filter(
                            (item) => item.rank === data.rank
                          ).length
                        }
                      </span>
                    </Col>
                    <Col xs={18} md={21}>
                      <div className="text-white text-normal text-bold mb-3">
                        Employee Rank #{data.rank}
                      </div>
                      <>
                      {data.budgetBasedData?.ghsPlan !== 'Plan0' && (
                        <GroupHorizontal className="mb-2">
                          <div className="mr-2">
                            <TickIcon />
                          </div>
                          <div className="text-x-small">
                            Medical card with Overal Annual Limit of {" "}
                            {ghs_GetAnnualLimitValue(data.budgetBasedData?.ghsPlan)} (Cashless
                            Admission)
                          </div>
                        </GroupHorizontal>
                        )}
                         {data.budgetBasedData?.gpspPlan !== 'Plan0' && (
                        <GroupHorizontal className="mb-2">
                          <div className="mr-2">
                            <TickIcon />
                          </div>
                          <div className="text-x-small">
                          Outpatient Clinical Visit, GP Overall Annual Limit is Unlimited and Specialist Practitioner Overall Annual Limit {" "}
                            {sp_GetAnnualLimitValue(data.budgetBasedData?.gpspPlan)} ({data.budgetBasedData?.gpspType})
                          </div>
                        </GroupHorizontal>
                        )}
                        {data.budgetBasedData?.gtl !== 'D0' && (
                        <GroupHorizontal className="mb-2">
                          <div className="mr-2">
                            <TickIcon />
                          </div>
                          <div className="text-x-small">
                            Death & disability with sum insured {" "}
                            {gtl_GetAnnualLimitValue(data.budgetBasedData?.gtl)}
                          </div>
                        </GroupHorizontal>
                        )}
                      </>
                    </Col>
                  </Row>
                </div>
              ))}
          </FormCardBody>
        </FormCard>
        <div style={{ position: "relative" }}>
          <PrimaryButton
            style={{
              position: "absolute",
              top: -15,
              left: "50%",
              transform: "translateX(-50%)",
            }}
            text="Send to Employee"
            onClick={onSendEmail}
            isLoading={isSubmitting}
          />
        </div>
      </FormContainer>
    </Wrapper>
  );
}

export default PurchaseSummary;
