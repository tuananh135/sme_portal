import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { AuthContext, AuthDispatchContext } from "contexts/AuthContext";
import Spinner from "common/components/Spinner/Spinner";

const PrivateTempRoute = () => {
    const { signinRedirect, getUser } = React.useContext(AuthDispatchContext);
    const { currentUser } = React.useContext(AuthContext);
    useEffect(() => {
        getUser();
    }, [])
    return <Outlet />;
};
export default PrivateTempRoute;