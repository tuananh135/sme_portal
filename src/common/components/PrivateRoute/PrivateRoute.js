import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { AuthContext, AuthDispatchContext } from "contexts/AuthContext";
import Spinner from "common/components/Spinner/Spinner";
import { USER_ROLE } from "common/constants/constants";
import { PAGE_LINK } from "common/constants/pagelinks";

const PrivateRoute = () => {
    const { signinRedirect, getUser } = React.useContext(AuthDispatchContext);
    const { currentUser } = React.useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (!!currentUser && currentUser.profile?.role?.includes(USER_ROLE.TEMPORARY_USER)) {
            return navigate(PAGE_LINK.FORBIDDEN_PAGE.NAME) 
         }
    }, [currentUser])
    
    return !!currentUser ? <Outlet /> : currentUser === undefined ? <Spinner size="large" /> : signinRedirect();
};
export default PrivateRoute;