import { mainAxios } from "common/axiosClient/AxiosClient";
import { B2C_ENDPOINT } from "common/constants/b2cEndpoint";

const UploadKycDocument = async (data) => {
  try {
    var result = await mainAxios.post(`${B2C_ENDPOINT.KYC}/uploadBase64`, data);
    return result;
  } catch (error) {
    return error;
  }
};

const UpdateKycStatus = async (data) => {
  try {
    var result = await mainAxios.patch(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/UpdateKycStatus`, {},
    {
      params: data,
    });
    return result;
  } catch (error) {
    return error;
  }
};

const SearchKYCReuploadStatus = async (id) => {
  try {
    var result = await mainAxios.get(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/SearchKYCReuploadStatus?groupId=${id}`);
    return result;
  } catch (error) {
    return error;
  }
};

const UpdateKYCReuploadStatus = async (id, newStatus) => {
  try {
    var result = await mainAxios.get(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/UpdateKYCReuploadStatus?groupId=${id}&newStatus=${newStatus}`);
    return result;
  } catch (error) {
    return error;
  }
};

export const KYCService = {
  UploadKycDocument,
  UpdateKycStatus,
  SearchKYCReuploadStatus,
  UpdateKYCReuploadStatus,
};
