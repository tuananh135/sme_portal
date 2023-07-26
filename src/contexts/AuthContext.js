import React, { createContext, useRef, useState } from "react";
import { getPageLinkByUrl, isPrivateLink, navigateToScreen } from "common/utils/browserUtils";
import { PAGE_LINK } from "common/constants/pagelinks";
export const AuthContext = createContext();
export const AuthDispatchContext = createContext();

export const AuthProvider = ({ userManager : manager,children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState();

  manager.events.addUserLoaded((user) => {
    if (window.location.href.indexOf("signin-oidc") !== -1) {
      navigateToScreen(PAGE_LINK.DETAIL_WELCOME.NAME);
    }
  });
  manager.events.addSilentRenewError((e) => {
    console.log("silent renew error", e.message);
  });

  manager.events.addAccessTokenExpired(() => {
    console.log("token expired");
    signinSilent();
  });

  const signinRedirectCallback = () => {
    manager
      .signinRedirectCallback()
      .then(
        (user) => {
          if (user) {
            const redirectScreen = localStorage.getItem("redirectUri");
            navigateToScreen(redirectScreen?? "/dashboard");
          }
        }
      ).catch(
        err => {
          console.log("signinRedirectCallback",err);
          // navigateToScreen(PAGE_LINK.ERROR_PAGE);
        }
      );
  };

  const getUser = async () => {
    const user = await manager.getUser().catch(err => {
      console.log("getUser error", err);
    });
    console.log(user);
    setCurrentUser(user);
    setIsAdmin(true);
    return user;
  };

  const signinRedirect = () => {
    localStorage.setItem("redirectUri", window.location.pathname);
    manager.signinRedirect({});
  };

  const signinSilent = () => {
    manager
      .signinSilent()
      .then((user) => {
        console.log("signed in", user);
        return true;
      })
      .catch((err) => {
        console.log("signinSilent err",err);
        if(isPrivateLink(window.location.pathname))signinRedirect();
        return false;
      });
  };
  const signinSilentCallback = () => {
    manager.revokeAccessToken()
    manager
      .signinSilentCallback()
      .then((user) => console.log("signinSilentCallback", user));
  };

  const createSigninRequest = () => {
    return manager.createSigninRequest();
  };

  const logout = () => {
    manager.signoutRedirect({
      id_token_hint: currentUser.id_token,
    });
    localStorage.clear();
    sessionStorage.clear();
    deleteAllCookies();
    manager.clearStaleState();
    manager.removeUser();
  };

  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  const signoutRedirectCallback = () => {
    manager.signoutRedirectCallback().then(() => {
      localStorage.clear();
      manager.clearStaleState();
      window.location.replace(process.env.REACT_APP_PUBLIC_URL);
    });
  };

  const changePassword = async (payload) => {
    //const result = await ProfileService.changePassword(payload);
    await getUser();
  }

  const isLoggedIn = async() => {
    const user = await manager.getUser();
    if (!user) {
        return false;
    }
    return !user.expired;
  }
  return (
    <AuthContext.Provider value={{ currentUser, isAdmin }}>
      <AuthDispatchContext.Provider
        value={{
          createSigninRequest,
          getUser,
          logout,
          signinRedirect,
          signinRedirectCallback,
          signinSilent,
          signinSilentCallback,
          signoutRedirectCallback,
          changePassword,
          isLoggedIn
        }}
      >
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};
