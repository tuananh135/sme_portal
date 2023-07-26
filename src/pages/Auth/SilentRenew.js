import { AuthContext, AuthDispatchContext } from "contexts/AuthContext";
import React, { useContext } from "react";

const SilentRenew = () => {
    const { signinSilentCallback } = useContext(AuthDispatchContext);
    signinSilentCallback();
    return(
     <span>loading</span>
    )
}
export default SilentRenew;