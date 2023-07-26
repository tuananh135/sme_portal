import { AuthDispatchContext } from "contexts/AuthContext";
import React, { useContext } from "react";
import Spinner from "common/components/Spinner/Spinner";

const Callback = () => {
    const { signinRedirectCallback } = useContext(AuthDispatchContext);
    signinRedirectCallback();
    return(
        <Spinner size="large" />
    )
}
export default Callback;