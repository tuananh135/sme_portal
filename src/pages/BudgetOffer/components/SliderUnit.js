import { Slider } from "antd";
import React from "react";
import styled from "styled-components";

const DescText = styled.div`
  justify-content: space-between;
`;
const DescBoldText = styled.div`
  justify-content: space-between;
  font-weight: 900;
`;

function SliderUnit({ item }) {
  console.log(item.marks)
  return (
    <div>
      <DescBoldText className="text-small d-flex mb-1">
        <span>{item?.primaryText}</span>
        <span>{item?.primaryPrice}</span>
      </DescBoldText>
      {item?.secondaryText && (
        <DescText className="text-small d-flex mb-2">
          <span>{item?.secondaryText}</span>
          <span>{item?.secondaryPrice}</span>
        </DescText>
      )}

      <Slider className="offer-slider" marks={item?.marks} defaultValue={50} />
    </div>
  );
}

export default SliderUnit;
