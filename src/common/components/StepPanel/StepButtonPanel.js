import CancelButton from "components/Button/CancelButton";
import PrimaryButton from "components/Button/PrimaryButton";
import React from "react";

function StepButtonPanel({
  wrapperStyles,
  cancelStyle,
  actionStyle,
  activeStep,
  prevButtonText,
  nextButtonText,
  nextAction,
  backAction,
  stepListLength
}) {
  return (
    <div style={wrapperStyles}>
      {activeStep > 0 && (
        <CancelButton
          style={cancelStyle}
          onClick={() => backAction()}
          text={prevButtonText ?? "BACK"}
        >
          Previous
        </CancelButton>
      )}
      {activeStep < stepListLength && (
        <PrimaryButton
          style={actionStyle}
          onClick={() => nextAction()}
          text={nextButtonText ?? "CONTINUE"}
        >
          Next
        </PrimaryButton>
      )}
      {activeStep === stepListLength && (
        <PrimaryButton
          style={actionStyle}
          htmlType="submit"
          text={"SUBMIT"}
        ></PrimaryButton>
      )}
    </div>
  );
}

export default StepButtonPanel;
