import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import { Image } from "antd";
import styled from "styled-components";
import logo from "assets/images/logo.png";
import BackPageButton from "../BackPageButton/BackPageButtom";
import { AuthDispatchContext } from "contexts/AuthContext";
import { LogoutOutlined } from "@ant-design/icons";
import Login from "pages/Auth/Login";
import { useNavigate } from "react-router-dom";
import { PAGE_LINK } from "common/constants/pagelinks";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10%;
  padding-right: 10%;
  z-index:999;
`;

const ImageWrapper = styled(Image)`
  max-height: 80px;
  max-width: 80px;
  margin-top: 30px;
`;

export default function DesktopHeader({currentPage, ...rest }) {
  const { getUser } = React.useContext(AuthDispatchContext);
  const [ currentUser, setCurrentUser ] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getUser().then((data) => {
      setCurrentUser(data);
    });
  }, []);
  
  return (
      <Wrapper {...rest} style={{ backgroundColor: "#fff" }}>
        {currentPage !== "welcome" && <BackPageButton></BackPageButton> }
        <ImageWrapper src={logo} preview={false} />
        <div className="d-flex">
          {
            currentUser
            ? <>
                <div style={{ display: 'inline-block', padding: '0px 15px 5px 0px' }}>{currentUser?.profile?.email}</div>
                <LogoutOutlined style={{ padding: '5px 0px 0px 0px' }} onClick={() => navigate(PAGE_LINK.LOGOUT.NAME)} />
              </>
            : <Login></Login>
          }
        </div>
      </Wrapper>
  );
}
