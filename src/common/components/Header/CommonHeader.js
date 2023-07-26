import React, { useEffect, useState } from "react";
import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import "antd/dist/antd.min.css";
import { Drawer, Image, PageHeader } from "antd";
import { AuthDispatchContext } from "contexts/AuthContext";
import Login from "pages/Auth/Login";
import styled from "styled-components";
import logo from "assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { PAGE_LINK } from "common/constants/pagelinks";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  z-index:999;
`;

const ImageWrapper = styled(Image)`
  max-height: 60px;
  max-width: 60px;
  margin-top: 12px;
`;

export default function CommonHeader({ ...rest }) {
  const { getUser } = React.useContext(AuthDispatchContext);
  const [ currentUser, setCurrentUser ] = useState({});
  const navigate = useNavigate();
  const onClickHomepage = () => {
    navigate('/');
  }

  useEffect(() => {
    getUser().then((data) => {
      setCurrentUser(data);
    });
  }, []);

  return (
    <Wrapper {...rest} style={{ backgroundColor: "black" }}>
      <ArrowLeftOutlined
        onClick={() => window.history.back()}
        style={{ fontSize: "16px", color: "white" }}
      />
      <ImageWrapper src={logo} className="cursor-pointer" preview={false} onClick={onClickHomepage} />
      <div className="d-flex">
        {
          currentUser
            ? <>
              {/* <div style={{ display: 'inline-block', padding: '0px 15px 5px 0px' }}>{currentUser?.profile?.email}</div> */}
              <LogoutOutlined style={{ fontSize: "16px", color: "#fff" }} onClick={() => navigate(PAGE_LINK.LOGOUT.NAME)} />
            </>
            : <Login mobile={true}></Login>
        }
      </div>
    </Wrapper>
  );
}
