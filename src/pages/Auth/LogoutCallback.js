import { AuthContext, AuthDispatchContext } from "contexts/AuthContext";
import React, { useContext } from "react";

const LogoutCallback = () => {
    const { signoutRedirectCallback } = useContext(AuthDispatchContext);
    signoutRedirectCallback();
    return(
     <span>loading</span>
    )
}
export default LogoutCallback;