
import { mainAxios } from "common/axiosClient/AxiosClient";
import { B2C_ENDPOINT } from "common/constants/b2cEndpoint";

const SendEmailToDirector = async (data) => {
        const result = await mainAxios.post(B2C_ENDPOINT.BUSINESS_DETAIL, data).then((res) => {
          if (res?.data?.code === 200) {
            return res;
          }
          return null;
        });
        return result;
  };

  export const DirectorAuthorisationService = {
    SendEmailToDirector
  }; 