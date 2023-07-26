
import { mainAxios } from "common/axiosClient/AxiosClient";
import { B2C_ENDPOINT } from "common/constants/b2cEndpoint";

const SubmitForm = async (data) => {
  const result = await mainAxios.post(`${B2C_ENDPOINT.BANK}/SubmitPaymentInfo`, data).then((res) => {
    if (res?.status === 200) {
      return res;
    }
  });
  return result;
};

const SubmitFPX = async (data) => {
  const result = await mainAxios.post(`${B2C_ENDPOINT.BANK}/SubmitFPXBank`, data).then((res) => {
    if (res?.status === 200) {
      return res;
    }
  });
  return result;
};

const GetBankFromCurlec = async () => {
  const result = await mainAxios.post(`${B2C_ENDPOINT.BANK}/GetBankItems`).then((res) => {
    if (res?.status === 200) {
      return res;
    }
  });
  return result;
};

export const BankService = {
  SubmitForm,
  SubmitFPX,
  GetBankFromCurlec,
}; 