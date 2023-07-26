import React from "react";
import styled from "styled-components";
import "./fading-dot.css";

const Dot = styled.div`
  background-color: ${(props) => props.color?? "white"};
  animation: fade ${(props) => props.speed ?? 0.8}s ease-in-out alternate infinite;
  width: ${(props) => props.size ?? 0.3}em;
  height: ${(props) => props.size ?? 0.3}em;
`;

function FadingDot({ number = 5, color, speed, size}) {
  return (
    <div className="dots">
      {Array(number)
        .fill(number)
        ?.map((item, index) => (
          <Dot key={index} color={color} speed={speed} size={size}></Dot>
        ))}
    </div>
  );
}

export default FadingDot;
