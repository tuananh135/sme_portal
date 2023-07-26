import ChatIcon from "common/components/ChatIcon/ChatIcon";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import "react-circular-progressbar/dist/styles.css";
import { SpinnerCircular } from "spinners-react";
import SliderUnit from "./components/SliderUnit";
import PrimaryButton from "common/components/Button/PrimaryButton";
import { ReactComponent as InfoIcon } from "assets/images/icon-info-white.svg";
import { Modal, Slider, Switch, Form, Radio, Col, Row, Tooltip } from "antd";
import { BudgetService } from "services/B2CService/BudgetService";
import { NotificationDispatchContext } from "contexts/NotificationContext";
import _ from "lodash";
import { GetMedicalFixedValue, GetDailyRoomAndBoard } from "common/constants/budgetConstant";
import { ReactComponent as ErrorIcon } from "assets/images/icon-error-small.svg";
import { ReactComponent as RedInfoIcon } from "assets/images/icon-info.svg";
import { addThousandSeparator } from "common/utils/stringUtils";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
`;
const PageText = styled.div`
  font-weight: bold;
  text-align: center;
  color: white;
  margin-top: 20px;
`;

const SwitchWrapper = styled.div`
  justify-content: space-between;
`;

const DescText = styled.div`
  justify-content: space-between;
`;
const DescBoldText = styled.div`
  justify-content: space-between;
  font-weight: 900;
`;
const StyledRadio = styled(Radio)`
  .ant-radio-disabled+span{
    color:gray;
  }
`
function OfferDetail({
  show,
  setShow,
  data,
  productInfo,
  coverType,
  currentIndex,
  rankList,
  setRankList,
}) {
  const [form] = Form.useForm();
  const [currentData, setCurrentData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [newData, setNewData] = useState(null);
  const [isDisableGhs, setDisableGhs] = useState(false);
  const [isDisableGpsp, setDisableGpsp] = useState(false);
  const [isDisableGtl, setDisableGtl] = useState(false);
  const { updateNotification } = useContext(NotificationDispatchContext);

  const ghsPlan = productInfo.filter((item) => item.optionType === "GHS_PLAN");
  const gpspPlan = productInfo.filter(
    (item) => item.optionType === "GPSP_PLAN"
  );
  const gtlPlan = productInfo.filter((item) => item.optionType === "GTL_PLAN");
  const ghsSliderMarks = Object.assign({}, ...ghsPlan.map((item, index) => ({ [(100 * index) / (ghsPlan.length - 1)]: item.optionValue, })));
  const gpspSliderMarks = Object.assign({}, ...gpspPlan.map((item, index) => ({ [(100 * index) / (gpspPlan.length - 1)]: item.optionValue, })));
  const gtlSliderMarks = Object.assign({}, ...gtlPlan.map((item, index) => ({ [(100 * index) / (gtlPlan.length - 1)]: item.optionValue, })));

  const convertToThousandSeperator = (data) => {
    const parsedData = parseFloat(data);
    if (isNaN(parsedData)) {
      return 0; // or any other desired behavior for invalid data
    }
    return addThousandSeparator(parsedData.toFixed(2));
  }

  const convertDataToFormValue = (currentData) => {
    if (!currentData) {
      return;
    }
    const currentGHSIndex = ghsPlan.findIndex(
      (item) => item.optionName === currentData.ghsPlan
    );
    const currentGPSPIndex = gpspPlan.findIndex(
      (item) => item.optionName === currentData.gpspPlan
    );
    const currentGTLIndex = gtlPlan.findIndex(
      (item) => item.optionName === currentData.gtl
    );
    return {
      ghs_plan: (100 * currentGHSIndex) / (ghsPlan.length - 1),
      ghs_type: currentData.ghsType,
      gpsp_plan: (100 * currentGPSPIndex) / (gpspPlan.length - 1),
      gpsp_type: currentData.gpspType,
      gtl_plan: (100 * currentGTLIndex) / (gtlPlan.length - 1),
    };
  };

  useEffect(() => {
    setCurrentData(data);
    if (data?.gpspPlan === "Plan0") {
      setDisableGpsp(true);
    } else {
      setDisableGpsp(false);
    }
    form.setFieldsValue(convertDataToFormValue(data));
  }, [data]);

  useEffect(() => {
    setCurrentData(data);
    if (data?.ghsPlan === "Plan0") {
      setDisableGhs(true);
    } else {
      setDisableGhs(false);
    }
    form.setFieldsValue(convertDataToFormValue(data));
  }, [data]);

  useEffect(() => {
    setCurrentData(data);
    if (data?.gtl === "D0") {
      setDisableGtl(true);
    } else {
      setDisableGtl(false);
    }
    form.setFieldsValue(convertDataToFormValue(data));
  }, [data]);

  const hideModal = () => {
    form.resetFields();

    setShow(false);
  };

  const onSwitchChange = (value) => {
    console.log(value);
  };

  const closetNumber = (counts, input) => {
    return counts.reduce(function (prev, curr) {
      return Math.abs(curr - input) < Math.abs(prev - input) ? curr : prev;
    });
  };

  const submitForm = async (type) => {
    console.log("first", form.getFieldsValue());
    setIsLoading(true);

    const formData = form.getFieldsValue();

    if (formData.gpsp_plan !== 0 && formData.ghs_plan === 0) {
      return;
    }

    const ghsSliderInt = Object.keys(ghsSliderMarks).map((x) => +x);
    const gpspSliderInt = Object.keys(gpspSliderMarks).map((x) => +x);
    const gtlSliderInt = Object.keys(gtlSliderMarks).map((x) => +x);

    let ghsPlanNumber = (closetNumber(ghsSliderInt, formData.ghs_plan) * (ghsPlan.length - 1)) / 100;
    let gpspPlanNumber = (closetNumber(gpspSliderInt, formData.gpsp_plan) * (gpspPlan.length - 1)) / 100;
    let gtlPlanNumber = (closetNumber(gtlSliderInt, formData.gtl_plan) * (gtlPlan.length - 1)) / 100;
    console.log("first", formData);
    if (gpspPlanNumber === 0) {
      setDisableGpsp(true);
    } else {
      setDisableGpsp(false);
    }
    if (ghsPlanNumber === 0) {
      setDisableGhs(true);
    } else {
      setDisableGhs(false);
    }
    if (gtlPlanNumber === 0) {
      setDisableGtl(true);
    } else {
      setDisableGtl(false);
    }

    const noSelection = "No selection";
    try {
      if (gpspPlanNumber === 0 && ghsPlanNumber === 0 && gtlPlanNumber === 0) {
        updateNotification([
          {
            id: Math.random(),
            message: "Sorry, we could not proceed if no product/plan is chosen. Please select at least one of the products/ plans for your employee coverage",
            types: "error",
          },
        ]);
      } else if (type === 0) {
        if (newData) {
          setRankList(newData);
          localStorage.setItem('budgetPerEmployee.suggestionData', JSON.stringify(newData));

          var newBudgetString = [];
          let isGtlList = []

          var newBudgetSource = JSON.parse(localStorage["budgetInput.budgetSource"]);
          for (let index = 0; index < newData.length; index++) {
            var newBudget = newData[index].totalPremiumPayableNett;
            newBudgetString.push(Math.ceil(parseFloat(newBudget)));
            newBudgetSource.value = newBudget;

            let combiNo = newData[index].combiNo;
            if (newData[index].ghsPlan === 'Plan0' && newData[index].gpspPlan === 'Plan0' && newData[index].gtl !== 'D0') {
              let data = { comboNo: combiNo, status: true }
              isGtlList.push(data);
            } else {
              let data = { comboNo: combiNo, status: false }
              isGtlList.push(data);
            }
          }
          localStorage.setItem('isGTLOnly', JSON.stringify(isGtlList));
          localStorage.setItem('budgetPerEmployee.budgetString', newBudgetString.join(','));
          localStorage.setItem('budgetInput.budgetSource', JSON.stringify(newBudgetSource));
        }
        hideModal();
        return;
      } else {
      }

      let currentItem = {
        budgetType: coverType,
        ghsType: ["YRT", "3YR"].includes(formData.ghs_type) ? formData.ghs_type : noSelection,
        ghsPlan: formData.ghs_plan === 0 ? "Plan0" : `Plan${ghsPlanNumber}`,
        gpspPlan: formData.gpsp_plan === 0 ? "Plan0" : `Plan${gpspPlanNumber}`,
        gpspType: ["Reimbursement", "Cashless"].includes(formData.gpsp_type) ? formData.gpsp_type : noSelection,
        gtl: gtlPlanNumber === 0 ? gtlPlan[0].optionName : gtlPlan[gtlPlanNumber]?.optionName,
      };
      const dataToCheck = newData?.length > 0 ? newData[currentIndex] : data;
      const isUpdateGHSFromZero = dataToCheck.ghsPlan === "Plan0" && currentItem?.ghsPlan !== "Plan0";
      const isUpdateGPSPFromZero = dataToCheck.gpspPlan === "Plan0" && currentItem?.gpspPlan !== "Plan0";
      const isUpdateGTLFromZero = dataToCheck.gtl === "D0" && currentItem?.gtl !== "D0";
      if (isUpdateGPSPFromZero && currentItem.gpspType === noSelection) {
        currentItem.gpspType = "Cashless";
      }
      if (currentItem.gpspPlan === "Plan0") {
        currentItem.gpspType = noSelection;
      }
      if (isUpdateGHSFromZero && currentItem.ghsType === noSelection) {
        currentItem.ghsType = "3YR";
      }
      if (currentItem.ghsPlan === "Plan0") {
        currentItem.ghsType = noSelection;
      }
      const needUpdateOthers = currentItem?.ghsType !== dataToCheck?.ghsType || currentItem?.gpspType !== dataToCheck?.gpspType
        || gtlPlanNumber === 0 || gpspPlanNumber === 0 || ghsPlanNumber === 0
        || isUpdateGTLFromZero || isUpdateGHSFromZero || isUpdateGPSPFromZero;
      let rankListClone = _.cloneDeep(rankList);
      rankListClone[currentIndex] = currentItem;
      rankListClone.forEach((element) => {
        element.currentIndex = currentIndex;
        element.isResetOthers = needUpdateOthers;
        element.isUpdateGHSFromZero = isUpdateGHSFromZero;
        element.isUpdateGPSPFromZero = isUpdateGPSPFromZero;
        element.isUpdateGTLFromZero = isUpdateGTLFromZero;
      });

      const result = await BudgetService.GetNewBudgetOnChange(rankListClone);
      if (result.data?.length > 0) {
        if (needUpdateOthers) {
          form.setFieldsValue(convertDataToFormValue(result.data[currentIndex]));
          setCurrentData(result.data[currentIndex]);
          setNewData(result.data);
        } else {
          form.setFieldsValue(convertDataToFormValue(result.data[0]));
          setCurrentData(result.data[0]);
          let rankListCopy = [...rankList];
          rankListCopy[currentIndex] = result.data[0];
          setNewData(rankListCopy);
        }
      } else {
        updateNotification([
          {
            id: Math.random(),
            message: "Can't find any combination with budget and type!",
            types: "error",
          },
        ]);
      }
    } catch (error) {
      updateNotification([
        {
          id: Math.random(),
          message: "Error during execution!",
          types: "error",
        },
      ]);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={show}
      onOk={hideModal}
      onCancel={hideModal}
      okText="Ok"
      cancelText="Cancel"
      className="modify-offer text-white d-flex"
      footer={null}
      closable={!isLoading}
    >
      <Wrapper className="text-white w-90">
        <ChatIcon pageName="budgetOfferCustomise" width={50} />
        <PageText className="text-x-large ">
          Drag the slider to your preferred Annual limit
        </PageText>
        <StepProgressTrigger/>
        <br></br>
        <div>
          <span style={{ fontSize: "30px", textDecoration: 'line-through' }} className="text-small" >
            RM {convertToThousandSeperator(currentData?.totalPremiumPayable)}
          </span>
        </div>

        <div>
          <span className="text-small">RM</span>
          <span style={{ fontSize: "40px" }} className="text-bold">
            {convertToThousandSeperator(currentData?.totalPremiumPayableNett)}
          </span>
          <Tooltip
            placement="topRight"
            title={
              <div><RedInfoIcon height={10} width={10} /> The Premium shown is<br />Annual Premium + MCO Fees* + Wellness Fees* <br />(*If applicable)</div>
            }
            color={"#fff"}
            showArrow={false}
            overlayClassName="text-x-small budget-offer-tooltip"
            overlayInnerStyle={{ color: "black" }}
          >
            <InfoIcon style={{ verticalAlign: "top" }} height={15} width={15} />
          </Tooltip>
        </div>
        <div className="w-100 mb-2 text-center text-small">
          <span className="ml-5">Per Employee</span>
        </div>
        <Form
          name="basic"
          initialValues={convertDataToFormValue(data)}
          size="small"
          form={form}
          onFinish={() => submitForm(0)}
          id="offer-detail-form"
          className="d-flex-c center-items w-100"
          autoComplete="off"
          onValuesChange={() => submitForm(1)}
        >
          <div className="background-main text-white px-3 text-left pt-5 pb-0 w-100 border-round mb-3">
            <div>
              <DescBoldText className={`text-small d-flex mb-1 ${isDisableGhs ? "text-gray" : "text-white"}`}>
                <span>Medical Card Overall Annual Limit</span>
                <span>{`RM ${currentData?.ghsNett}`}</span>
              </DescBoldText>
              <DescText className={`text-small d-flex mb-1 ${isDisableGhs ? "text-gray" : "text-white"}`}>
                <span>Daily Room & Board</span>
                <span>{GetDailyRoomAndBoard(currentData?.ghsPlan)}</span>
              </DescText>
              <Form.Item
                name="ghs_plan"
                rules={[
                  {
                    message: <div className="d-flex">
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>
                        GHS cannot be zero with given GPSP!
                      </div>
                    </div>,
                    validator: (_, value) => {
                      const gpsp_plan = form.getFieldValue("gpsp_plan");
                      if (gpsp_plan !== 0 && value === 0)
                        return Promise.reject();
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Slider className="offer-slider" marks={ghsSliderMarks} draggableTrack={false} step={null} />
              </Form.Item>
            </div>
            <SwitchWrapper className="background-main text-white px-0 py-5 w-100 border-round mb-1 mt-3 d-flex">
              <Form.Item name="ghs_type" className="w-100">
                <Radio.Group disabled={isDisableGhs} className="w-100">
                  <Row>
                    <Col span={12}>
                      <StyledRadio
                        className="red-radio text-white text-small"
                        style={{ marginRight: "0px" }}
                        value="3YR"
                      >
                        3 Years Premium Guarantee with Active8
                      </StyledRadio>
                    </Col>
                    <Col span={12}>
                      <StyledRadio
                        className="red-radio text-white text-small"
                        style={{ marginRight: "0px" }}
                        value="YRT"
                      >
                        Yearly Premium
                      </StyledRadio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
            </SwitchWrapper>
          </div>

          <div className="background-main text-white text-left px-3 pt-5 pb-0 w-100 border-round mb-3">
            <div>
              <DescBoldText className={`text-small d-flex mb-1 ${isDisableGpsp ? "text-gray" : "text-white"}`}>
                <span>Outpatient Clinical Visit Overall Annual Limit</span>
                <span>{`RM ${currentData?.gpspNett}`}</span>
              </DescBoldText>
              <DescText className={`text-small d-flex mb-0 ${isDisableGpsp ? "text-gray" : "text-white"}`}>
                <span>General Practitioner (GP)</span>
              </DescText>
              <Slider className={`offer-slider offer-slider-disabled  ${isDisableGpsp ? "offer-slider-disabled-track" : ""}`} defaultValue={100} marks={{ 0: "", 100: "Unlimited" }} />
              <DescText className={`text-small d-flex mb-0 mt-5 ${isDisableGpsp ? "text-gray" : "text-white"}`}>
                <span>Specialist Practitioner (SP)</span>
              </DescText>
              <Form.Item name="gpsp_plan"
                rules={[
                  {
                    message: <div className="d-flex" >
                      <ErrorIcon width={20}> </ErrorIcon>
                      <div>
                        GHS cannot be zero with given GPSP!
                      </div>
                    </div>,
                    validator: (_, value) => {
                      const ghs_plan = form.getFieldValue("ghs_plan");
                      if (ghs_plan === 0 && value !== 0)
                        return Promise.reject();
                      return Promise.resolve();
                    },
                  },
                ]}>
                <Slider
                  className="offer-slider"
                  marks={gpspSliderMarks}
                  draggableTrack={false}
                  step={null}
                />
              </Form.Item>
            </div>
            <SwitchWrapper className="background-main text-white px-0 py-5 w-100 border-round mb-1 mt-3 d-flex">
              <Form.Item
                name="gpsp_type"
                className="w-100"
              >
                <Radio.Group disabled={isDisableGpsp} className="w-100">
                  <Row>
                    <Col span={12}>
                      <StyledRadio
                        className="red-radio text-white text-small"
                        style={{ marginRight: "0px" }}
                        value="Cashless"
                      >
                        Cashless
                      </StyledRadio>
                    </Col>
                    <Col span={12}>
                      <StyledRadio
                        className="red-radio text-white text-small w-50"
                        style={{ marginRight: "0px", color: "white" }}
                        value="Reimbursement"
                      >
                        Reimbursement
                      </StyledRadio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
            </SwitchWrapper>
          </div>
          <div className="background-main text-white px-3 pt-5 pb-2 w-100 border-round mb-3">
            <div>
              <DescBoldText className={`text-small d-flex mb-1 ${isDisableGtl ? "text-gray" : "text-white"}`}>
                <span>Death & Disability Sum Assured</span>
                <span>{`RM ${currentData?.gtlNett}`}</span>
              </DescBoldText>
              <Form.Item name="gtl_plan">
                <Slider className="offer-slider offer-slider-last mb-5" marks={gtlSliderMarks} step={null} />
              </Form.Item>
            </div>
          </div>

          <PrimaryButton
            rootclass="half-width-button"
            text={"Save & Close"}
            htmlType="submit"
            isLoading={isLoading}
          />
        </Form>
      </Wrapper>
    </Modal>
  );
}

export default OfferDetail;
