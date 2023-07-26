import _ from "lodash";

export const UWStatus = {
    EMPLOYEE_FAILED: "EMPLOYEE_FAILED",
    DEPENDENT_FAILED: "DEPENDENT_FAILED",
    PASSED: "PASSED"
}

export const checkHealthQuestionsPassed = (formdata) => {
    const healthQuestions = _.get(formdata, "healthQuestions", []);
    if (!healthQuestions.length || healthQuestions.some(s => s.answer?.toLowerCase() !== "no" )) {
        return UWStatus.EMPLOYEE_FAILED;
    }

    const noDependent = _.get(formdata, "dependents[0].noDependent", 0);
    const healthQuestionsDependents = _.flatMap(formdata.dependents, "healthQuestions");
    
    if (noDependent > 0 && healthQuestionsDependents.some(s => !s || s.answer?.toLowerCase() !== "no")) {
        return UWStatus.DEPENDENT_FAILED;
    }

    return UWStatus.PASSED
}