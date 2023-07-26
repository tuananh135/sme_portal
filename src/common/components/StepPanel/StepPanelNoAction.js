import React, { useState } from "react";
import CancelButton from "components/Button/CancelButton";
import PrimaryButton from "components/Button/PrimaryButton";
import { Col } from "antd";

function StepPanelNoAction({
  steps,
  className,
  styles,
  validateAction,
}) {
  let currentStepData = steps[activeStep];
  const next = async () => {
    const nextStep = activeStep + 1;
    if (validateAction) {
      const validateResult = await validateAction();
      if (validateResult) {
        currentStepData?.nextAction && (await currentStepData?.nextAction());
        setActiveStep(nextStep);
      }
    } else {
      setActiveStep(nextStep);
    }
  };

  const prev = async () => {
    const prevStep = activeStep - 1;
    // prevAction && await prevAction();
    setActiveStep(prevStep);
  };
  return (
    <>
      {!currentStepData?.notShowHeader && (
        <>
          <Col span={24}>
            <div className="Page-name">
              {currentStepData?.header ?? "Import Employee"}
            </div>
          </Col>
          <Col span={24} className="my-5">
            <hr className="border-grey" />
          </Col>
        </>
      )}
      <div className={className} style={styles}>
        <div> {currentStepData?.content}</div>
      </div>
    </>
  );
}

export default StepPanelNoAction;
