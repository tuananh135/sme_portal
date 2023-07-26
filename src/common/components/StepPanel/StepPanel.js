import React, { useState } from "react";
import CancelButton from "common/components/Button/CancelButton";
import PrimaryButton from "common/components/Button/PrimaryButton";
import { Col } from "antd";

function StepPanel({
  steps,
  className,
  actionWrapperStyles,
  styles,
  actionStyle,
  cancelStyle,
  validateAction,
  showStepButton,
  isSubmitting
}) {
  const [activeStep, setActiveStep] = useState(0);
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
        {showStepButton && (
          <div style={actionWrapperStyles}>
            {activeStep > 0 && (
              <CancelButton
                style={cancelStyle}
                onClick={() => prev()}
                text={currentStepData?.prevButtonText ?? "BACK"}
              >
                Previous
              </CancelButton>
            )}
            {activeStep < steps.length - 1 && (
              <PrimaryButton
                style={actionStyle}
                onClick={() => next()}
                text={currentStepData?.nextButtonText ?? "CONTINUE"}
                loading={isSubmitting}
              >
                Next
              </PrimaryButton>
            )}
            {activeStep === steps.length - 1 && (
              <PrimaryButton
                style={actionStyle}
                htmlType="submit"
                text={"SUBMIT"}
                loading={isSubmitting}
              ></PrimaryButton>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StepPanel;
