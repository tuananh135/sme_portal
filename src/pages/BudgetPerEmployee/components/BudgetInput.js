import { Button, Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { ReactComponent as RemoveIcon } from "assets/images/icon-remove.svg";
import { ReactComponent as ErrorIcon } from "assets/images/icon-error-small.svg";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";


//#region Custom theme
const BlackOpacity = styled.div`
  content: " ";
  height: 100vh;
  width: 100vw;
  background: #444444;
  opacity: 0.8;
  position: absolute;
  left: 0px;
`;

const BodyContent = styled.div`
  color: white;
  text-align: center;
  font-size: larger;
  opacity: 0.9;
`;

const RemoveStyledIcon = styled(RemoveIcon)`
  height: 16px;
  width: 16px;
  position: absolute;
  top: 20px;
  right: 4px;
  z-index: 999 !important;
`;
//#endregion

export default function BudgetInput({ nextStep, budgetInputHandler }) {
  const [budgetSource, setBudgetList] = budgetInputHandler;
  const [form] = Form.useForm();
  const [showButton, setShowButton] = useState(false);
  // const [maximumInsert] = useState(5);
  const [maximumInsert, setMaximumInsert] = useState(budgetSource.length === 5 ? 5 : 10);
  const [nextIndex, setNextIndex] = useState(2);

  const onChange = (e, key) => {
    if (e.target.value.length > 0) {
      setShowButton(true);
      budgetSource[key - 1].value = e.target.value;
      setBudgetList(budgetSource);
    }
  };

  const handleNextStep = () => {
    localStorage.setItem('budgetInput.budgetSource', JSON.stringify(budgetSource));
    nextStep();
  }

  const addEmployee = (e) => {
    if (budgetSource.length+1 > maximumInsert) {
      return;
    }

    setShowButton(true);
    budgetSource[0].label = "Per Employee - Rank 1";
    budgetSource.push({
      key: nextIndex,
      label: "Per Employee - Rank " + (budgetSource.length + 1),
      placeHolder: "Ex: RM " + 200 * (budgetSource.length + 1) + ".00",
      value: 0,
      display: true,
    });
    setNextIndex(nextIndex + 1);

    if (budgetSource.length === 5) { // When budgetSource.length reaches 5, maximumInsert is set to 5
      setMaximumInsert(5);
    }

    setBudgetList(budgetSource);
  };

  const removeBudgetSource = (index) => {
    const newBudgetSource = budgetSource.filter((item, i) => i !== index);

    const reIndexedBudgetSource = newBudgetSource.map((item, i) => ({
      ...item,
      label: `Per Employee - Rank ${i + 1}`,
      placeHolder: `Ex: RM ` + 200 * (i + 1) + `.00`, // update the placeholder value
      value: item.value,
      display: true,
        }));      
        setBudgetList(reIndexedBudgetSource);

        if (reIndexedBudgetSource.length === 5) { // When budgetSource.length reaches 5, maximumInsert is set to 5
          setMaximumInsert(5);
        }   

        const resetMaximumInsert = () => {
          setMaximumInsert(reIndexedBudgetSource.length);
        }
      };
  

  useEffect(() => {
    setBudgetList([
      {
        key: 1,
        label: "Per Employee",
        placeHolder: "Ex: RM 200.00",
        value: "",
        display: true,
      },
    ]);
  }, []);

  return (
    <BodyContent>
      <ChatIcon pageName="budgetInput" width={50} />
      <Row style={{ justifyContent: "center" }}>How much do you budget</Row>
      <Row style={{ justifyContent: "center" }}>per employee in a year?</Row>
      <StepProgressTrigger/>
      <Form
        name="budget"
        size="small"
        form={form}
        onFinish={handleNextStep}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
        id="budget-form"
        autoComplete="off"
        className="center-items d-flex-c text-white w-100 text-left"
      >
          {budgetSource.map((m, index) => (
            <Col key={index} span={24} className="max-width-input w-90">
              <label
                style={{
                  display: "-webkit-box",
                  fontSize: "x-small",
                  marginBottom: 5,
                  marginTop: 10,
                }}
              >               
                {m.label}
              </label> 

          {index > 0 && index === budgetSource.length - 1 &&  (
            <RemoveStyledIcon
              className="cursor-pointer"
              onClick={() => removeBudgetSource(index)}
            />
          )}     
              <Form.Item
              name={`rank${m.key}`}
              rules={[
                {
                  pattern: /^(?:\d*)$/,
                  message: <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>
                      Value should contain just number
                    </div>
                  </div>,
                },
                {
                  max: 4,
                  message: <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>
                      Value should be less than 4 character
                    </div>
                  </div>,
                },
                {
                  required: true,
                  message: <div className="d-flex">
                    <ErrorIcon width={20}> </ErrorIcon>
                    <div>
                      Value is required
                    </div>
                  </div>,
                }
              ]}
              className="max-width-input w-100"
            >
              <Input
                style={{ borderRadius: 7 }}
                size="small"
                placeholder={m.placeHolder}
                allowClear
                onChange={(e) => onChange(e, m.key)}
                type="number"
              />
              </Form.Item>
            </Col>
          ))}
        <Row
          style={{ justifyContent: "flex-end" }}
          className="max-width-input w-90 self-center"
        >    
        <Button
        style={{
          color: "#ef8885",
          display: budgetSource.length+1 <= maximumInsert ? "flex" : "none",
          padding: "4px 0px",
          marginTop: 15,
        }}
        type="link"
        onClick={addEmployee}
      >
        Add Employee Rank +
      </Button>
      </Row>
        <Row
          style={{ display: showButton ? "block" : "none", marginTop: "35px" }}
        >
          <Button
            className="half-width-button"
            style={{
              backgroundColor: "#ec5a54",
              color: "white",
              width: "55vw",
              height: "40px",
              borderRadius: "5px",
              border: "0px",
            }}
            htmlType="submit"
          >
            Next
          </Button>
        </Row>
      </Form>
    </BodyContent>
  );
}