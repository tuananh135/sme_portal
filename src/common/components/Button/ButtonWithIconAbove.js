import { Button, Image } from "antd";
import React from "react";
import styled from "styled-components";

const StyledButton = styled(Button)`
  padding-left: 8px !important;
  padding-right: 8px !important;
  padding-bottom: 16px !important;
  padding-top: 16px !important;
  @media only screen and (min-width: 768px) {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: end;
  flex-direction: column;
  align-items: center;
`;
const StyledImage = styled(Image)`
  height: 48px!important;
  width: 48px!important;
  margin-top: 16px;
  z-index: 1001;
`;

function ButtonWithIconAbove({ className, imageStyle, style, text, img, ...rest }) {
  return (
    <Wrapper className="tune-button-image  px-2 py-2" {...rest}>
      <StyledImage
        src={img}
        sizes="10px"
        preview={false}
      />
      <StyledButton className="border-round text-primary text-small text-bold">
        {text}
      </StyledButton>
    </Wrapper>
  );
}

export default ButtonWithIconAbove;
