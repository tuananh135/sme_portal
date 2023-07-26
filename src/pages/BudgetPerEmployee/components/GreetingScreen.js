import { Image } from "antd";
import styled from "styled-components";
import avatar from "assets/images/nina-big.png";
import FadingDot from "common/components/LoadingAnimation/FadingDot";

//#region Custom theme
const BlackOpacity = styled.div`
  content: " ";
  height: 100vh;
  width: 100vw;
  background: #444444;
  opacity: 0.8;
  position: absolute;
  left: 0px;
`;

const BodyContent = styled.div`
  color: white;
  text-align: center;
  font-size: larger;
  opacity: 1;
  animation: fade 2s ease-in-out alternate;
`;
//#endregion

export default function GreetingScreen({isLoading, isShowingGreeting}) {
  return (
    <>
      {isLoading ? (
        <div
          style={{
            paddingTop: "35vh",
            color: "white",
            textAlign: "center",
            fontSize: "x-large",
          }}
        >
          <FadingDot />
        </div>
      ) : isShowingGreeting ? (
        <BodyContent>
          <Image
            style={{ marginTop: "15vh" }}
            src={avatar}
            preview={false}
          ></Image>
          <p style={{ paddingTop: 10 }}>HELLO!</p>
          <p>Let's take good care of your people!</p>
        </BodyContent>
      ) : (
        <></>
      )}
    </>
  );
}
