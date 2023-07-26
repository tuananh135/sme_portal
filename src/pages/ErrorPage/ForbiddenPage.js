import { Image } from "antd";
import React from "react";
import forbidden from "assets/images/403.png";
import styled from "styled-components";

const ImageWrapper = styled.div`
  height: 100vh; /* Can be anything */
  width: 100vw; /* Can be anything */
  position: relative;
  .ant-image, .ant-image-img {
    max-height: 100%;
    max-width: 100%;
    width: auto;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
`;

function ForbiddenPage() {
  return (
    <ImageWrapper>
      <Image src={forbidden} preview={false} />
    </ImageWrapper>
  );
}

export default ForbiddenPage;
