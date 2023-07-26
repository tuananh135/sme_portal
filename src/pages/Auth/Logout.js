import { AuthDispatchContext } from "contexts/AuthContext";
import React, { useContext } from "react";
import Spinner from "common/components/Spinner/Spinner"

const Logout = () => {
    const { logout } = useContext(AuthDispatchContext);
    logout();
    return(
        <Spinner size="large" />
    )
}
export default Logout;