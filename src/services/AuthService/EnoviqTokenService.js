import axios from "axios";
import { enoviqAxios } from "common/axiosClient/AxiosClient";
import { ENOVIQ_ENDPOINT } from "common/constants/enoviqEndpoint";

export const getEnoviqAccessToken = async () => {
    try {
        const result = await enoviqAxios.post(ENOVIQ_ENDPOINT.TOKEN, {
          "flag": "string",
          "user_Type": "Employee",
          "user_Nm": "EBPortal",
          "password": "JfAinC/QVLpPkJcsYHq6KbiXiht5DD+G",
          "iP_Address": "127.0.0.1",
          "application_Source": "EBPortal",
          "is_External": true,
          "secret_Key": "707c8bc889836365d96147c2522a4c80"
          });
        if (result?.data?.ErrorObj[0]?.ErrorMessage != "Success") {
            console.error("error during get enoviq token",result);
            return;
        }
        localStorage.setItem("enoviqToken", JSON.stringify(result?.data?.ResponseObj?.Token));
        return result;
      } catch (error) {
        return error;
      }
  };