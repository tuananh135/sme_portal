import React from 'react'
import { ReactComponent as LoginIcon } from "assets/images/btn-login.svg";
import { UserOutlined } from "@ant-design/icons";
import { AuthDispatchContext } from 'contexts/AuthContext';

export default function Login({ mobile }) {
  const { signinRedirect, isLoggedIn } = React.useContext(AuthDispatchContext);
  const handleLogin = async () => {
    var isLogin = await isLoggedIn();
    if (!isLogin)
      signinRedirect();
  }
  return (
    <>
      {!mobile ?
        <LoginIcon style={{ fontSize: "16px", marginRight: 5 }} onClick={handleLogin} />
        : <UserOutlined style={{ fontSize: "16px", color: "#fff" }} onClick={handleLogin} />}
    </>
  )
}
