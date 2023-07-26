import { identityAxios, mainAxios } from "common/axiosClient/AxiosClient";
import { B2C_ENDPOINT } from "common/constants/b2cEndpoint";

const PostDocument = async(data) => {
  try {
    var result = await mainAxios.post(`${B2C_ENDPOINT.FILE}`, data);
    return result;
  } catch (error) {
    return error;
  }
};

const PostManyDocument = async(data) => {
  try {
    var result = await mainAxios.post(
      `${B2C_ENDPOINT.FILE}/uploadBase64`,
      data
    );
    return result;
  } catch (error) {
    return error;
  }
};

const GetDocumentByGroup = async(groupId) => {
  try {
    var result = await mainAxios.get(
      `${B2C_ENDPOINT.FILE}/GetFileByGroupId/${groupId}`
    );
    return result;
  } catch (error) {
    return error;
  }
};

export const DocumentService = {
  PostDocument,
  PostManyDocument,
  GetDocumentByGroup
};
