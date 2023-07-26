import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import { Form, Input, Radio } from "antd";
import { HEALTH_QUESTIONS } from "common/constants/constants";

const Slider = styled.div`
  -webkit-animation: animation ease 1s;
  animation-delay: 0.8s;
  animation-fill-mode: backwards;
  padding-top: 50px;
  margin: 0 auto 0 auto;
  height: 60vh;
  width: 80vw;
  max-width:500px;
  top: 100px;
  perspective: 1000px;
  transition: ease-in-out 0.2s;
  margin-bottom: 50px;
  .ant-form-item{
    height:0px;
  }
`;

const Slide = styled.div`
  -webkit-user-select: none;
  user-select: none;
  -moz-user-select: none;
  position: absolute;
  height: 55vh;
  min-height: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.3);
  background: #fcfcfc;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  text-align: center;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 10px;
  text-align: center;
  @media only screen and (min-width: 768px) {
    padding: 30px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const PageText = styled.div`
  font-weight: bold;
  justify-content: center;
  color: white;
  margin-top: 30px;
  margin-bottom: 50px;
`;
const FormContainer = styled.div`
  margin-bottom: 50px;
  max-width: 600px;
`;
const Group = styled.div`
  margin-top: 40px;
  padding: 15px;
  @media only screen and (min-width: 768px) {
    padding: 30px;
  }
`
const GroupHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

function HealthQuestion({ form, onNext, onBack }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    // Init health question for emp
    const questions = form.getFieldValue("healthQuestions")
    if (!questions || questions.some(s => !s.questionCd) || questions.length < HEALTH_QUESTIONS.length) {
      form.setFieldValue("healthQuestions", HEALTH_QUESTIONS);
    }
    const noDependent = form.getFieldValue(["dependents", 0, "noDependent"]);
    if (!!noDependent) {
      let dependents = form.getFieldValue(["dependents"]);
      let needToSet = false;
      for (let i = 0; i <= dependents.length; i++) {
        const healthQuestions = _.get(dependents[i], `healthQuestions`, null);
        if (!healthQuestions || healthQuestions.length < HEALTH_QUESTIONS.length) {
          needToSet = true;
          _.set(dependents[i], "healthQuestions", HEALTH_QUESTIONS);
        }
      }
      if (needToSet) {
        form.setFieldValue("dependents", dependents)
      }
    }
  }, [])

  const checkAllAnswersWereNotDone = (index) => {

    const answer = form.getFieldValue(["healthQuestions", index, "answer"]);
    if (!answer) {
      return true;
    }

    const noDependent = form.getFieldValue(["dependents", 0, "noDependent"]);
    if (!noDependent) {
      return false;
    }

    let result = false;
    const dependents = form.getFieldValue(["dependents"]);
    dependents.forEach(dependent => {
      if (!_.get(dependent, `healthQuestions[${index}].answer`)) {
        result = true;
        return;
      }
    })

    return result;
  }

  const onRadioChange = () => {
    // Set isAnswered state to true when a radio button is selected
    setIsAnswered(true);
  };
  const onClickNext = () => {
    if (currentQuestionIndex + 1 >= HEALTH_QUESTIONS.length) {
    
      onNext();
    }
    else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
      // Reset isAnswered state for the next question

    setIsAnswered(false);
  }

  const onClickBack = () => {
    if (currentQuestionIndex <= 0) {
      onBack();
    }
    else {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  return (
    <Wrapper>
      <ChatIcon pageName="UnderwritingQuestion"/>
      <PageText className="text-x-large text-center">
        Please answer health question below
      </PageText>
      <FormContainer>
        <Slider className="slider">
          {HEALTH_QUESTIONS.map((question, index) => {
            return (
              <Slide style={{ display: index === currentQuestionIndex ? "flex" : "none" }} className="slide" key={`${index + 1}`}>
                <p className="pt-4">{question.title}</p>
                <span className="text-bold">
                  {question.desc}
                </span>
                <div>
                  <Group>
                    <GroupHorizontal>
                      <div>{form.getFieldValue("name")}</div>
                      <Form.Item
                        name={["healthQuestions", index, "answer"]}
                      >
                        <Radio.Group onChange={onRadioChange}>
                          <Radio
                            className="red-radio mb-2 mr-3"
                            value="Yes"
                          >
                            Yes
                          </Radio>
                          <Radio
                            className="red-radio mb-2"
                            value="No"
                          >
                            No
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </GroupHorizontal>
                    {!!form.getFieldValue(["dependents", 0, "noDependent"]) && [
                      ...Array(
                        form.getFieldValue(["dependents", 0, "noDependent"])
                      ).keys(),
                    ].map((_, iDependent) => (
                      <GroupHorizontal key={`${index}_${iDependent}`}>
                        <div>{form.getFieldValue(["dependents", iDependent, "name"])}</div>
                        <Form.Item
                          name={["dependents", iDependent, "healthQuestions", index, "answer"]}
                        >
                          <Radio.Group onChange={onRadioChange}>
                            <Radio
                              className="red-radio mb-2 mr-3"
                              value="Yes"
                            >
                              Yes
                            </Radio>
                            <Radio
                              className="red-radio mb-2"
                              value="No"
                            >
                              No
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </GroupHorizontal>
                    ))}
                  </Group>
                </div>
                <div style={{ marginTop: "auto" }} className="w-100 text-center mb-5">
                  <PrimaryButton
                    text={"NEXT"}
                    rootclass="half-width-button"
                    disabled={!isAnswered}
                    onClick={onClickNext}
                  />
                </div>
              </Slide>
            );
          })}
        </Slider>
        <div className="text-white text-start" id="back" onClick={onClickBack}>
          BACK
        </div>
      </FormContainer>
    </Wrapper>
  );
}

export default HealthQuestion;
