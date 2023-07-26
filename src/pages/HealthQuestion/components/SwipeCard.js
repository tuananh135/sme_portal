import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as AgreeIcon } from "assets/images/icon-tick.svg";
import { ReactComponent as DisagreeIcon } from "assets/images/icon-remove.svg";
import setup, { agree } from "common/utils/sliderAnimation";

const Slide = styled.div`
  -webkit-user-select: none;
  user-select: none;
  -moz-user-select: none;
  position: absolute;
  height: 55vh;
  width: 100%;

  box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.3);
  background: #fcfcfc;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  text-align: center;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 10px;
  text-align: center;
`;

const GroupHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 15vh;
  padding: 0 15%;
  justify-content: space-between;
`;

function SwipeCard({ title, desc, value, onChange, form, index }) {
  //const [state, setState] = useState(value);
  useEffect(() => {
    setup(
      () => {
        onAgreeSwipe();
      },
      () => {
        onDisagreeSwipe();
      },
      index
    );
  }, []);

  const onAgreeSwipe = () => {
    form.setFieldValue(["HealthQuestions", index], {
      title,
      desc,
      answer: true,
    });
  };

  const onDisagreeSwipe = () => {
    console.log("onAgree123", index);
    form.setFieldValue(["HealthQuestions", index], {
      title,
      desc,
      answer: false,
    });
  };

  const onAgree = (e) => {
    console.log("onAgree", e);
    agree(e);
    onChange?.(true);
  };

  return (
    <Slide className="slide" id={`s${index}`}>
      <p className="pt-4">{title}</p>
      <span className="text-bold">{desc}</span>
      <GroupHorizontal>
        <DisagreeIcon style={{ height: 70, width: 70 }} />
        <AgreeIcon onClick={onAgree} style={{ height: 70, width: 70 }} />
      </GroupHorizontal>
    </Slide>
  );
}

export default SwipeCard;
