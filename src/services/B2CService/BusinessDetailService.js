
import { mainAxios } from "common/axiosClient/AxiosClient";
import { B2C_ENDPOINT } from "common/constants/b2cEndpoint";

const PostBusinessDetail = async (data, rankData) => {
        const result = await mainAxios.post(B2C_ENDPOINT.BUSINESS_DETAIL, data).then((res) => {
          if (res?.status === 200) {
            return res;
          }
          return null;
        });
        return result;
  };
  
  const SearchEmployeeGroupNotFinish = async (userId) => {
    const result = await mainAxios.post(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/SearchEmployeeGroupNotFinish?userId=${userId}`).then((res) => {
      if (res?.status === 200) {
        return res;
      }
      return null;
    });
    return result;
  };
  
  const SearchEmployeeGroupNotFinishByID = async (id) => {
    const result = await mainAxios.post(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/SearchEmployeeGroupNotFinishByID?id=${id}`).then((res) => {
      if (res?.status === 200) {
        return res;
      }
      return null;
    });
    return result;
  };

  export const BusinessService = {
    PostBusinessDetail,
    SearchEmployeeGroupNotFinish,
    SearchEmployeeGroupNotFinishByID,
  }; 