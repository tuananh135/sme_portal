import { useContext, useMemo } from "react";
import { getToken, navigateToScreen } from "../common/utils/browserUtils";
import { ENOVIQ_ENDPOINT } from "common/constants/enoviqEndpoint";
import { API_VENDOR } from "common/constants/constants";
import { enoviqAxios, mainAxios } from "common/axiosClient/AxiosClient";
import { getEnoviqAccessToken } from "services/AuthService/EnoviqTokenService";
import { CommonStateDispatchContext } from "contexts/CommonStateContext";

const AxiosInterceptor = ({ children }) => {
  const { updateLoadingState } = useContext(CommonStateDispatchContext);

  useMemo(() => {
    mainAxios.interceptors.request.use(
      function (config) {
        updateLoadingState(true);
        // Do something before request is sent
        let token;
        token = getToken().access_token;
        config.headers["Authorization"] = "bearer " + token;
        return config;
      },
      function (error) {
        updateLoadingState(false);
        // Do something with request error]
        return Promise.reject(error);
      }
    );
    // Add a response interceptor
    mainAxios.interceptors.response.use(
      function (response) {
        updateLoadingState(false);
        return response;
      },
      function (error) {
        updateLoadingState(false);
          return Promise.reject(error);
      }
    );
  

  enoviqAxios.interceptors.request.use(
    function (config) {
      updateLoadingState(true);
      // Do something before request is sent
      let token;
      token = getToken(API_VENDOR).access_token;
      config.headers["Authorization"] = "bearer " + token;
      return config;
    },
    function (error) {
      updateLoadingState(false);
      // Do something with request error]
      return Promise.reject(error);
    }
  );
  // Add a response interceptor
  enoviqAxios.interceptors.response.use(
    function (response) {
      updateLoadingState(false);
      return response;
    },
    function (error) {
      updateLoadingState(false);
        if (
          error.response?.status !== 401 ||
          error.request?.url?.includes(ENOVIQ_ENDPOINT.REFRESH_TOKEN)
        ) {
          return Promise.reject(error);
        }
      
      return getEnoviqAccessToken()
        .then((response) => {
          if (response?.data?.ErrorObj[0]?.ErrorMessage === "Success") {
            error.response.config.headers["Authorization"] = "Bearer " + response?.data?.ResponseObj?.Token?.Access_Token;
            return enoviqAxios(error.response.config);
          }
          return Promise.reject(response);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
  );
}, []);

  return children;
};

export default AxiosInterceptor;
