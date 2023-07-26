import { mainAxios } from "common/axiosClient/AxiosClient";
import { B2C_ENDPOINT } from "common/constants/b2cEndpoint";

const GetProductOptions = async () => {
  try {
    var result = await mainAxios.get(`${B2C_ENDPOINT.BUDGET}/ProductOptions`);
    return result;
  } catch (error) {
    return error;
  }
};
const GetBusinessCategory = async () => {
  try {
    var result = await mainAxios.get(`${B2C_ENDPOINT.CATEGORY}/BusinessCategory`);
    return result;
  } catch (error) {
    return error;
  }
}
const GetCountryCategory = async () => {
  try {
    var result = await mainAxios.get(`${B2C_ENDPOINT.CATEGORY}/Country`);
    return result;
  } catch (error) {
    return error;
  }
};
const GetCountryByCountryName = async (countryName) => {
  try {
    var result = await mainAxios.get(`${B2C_ENDPOINT.CATEGORY}/CountrybyCountryName?countryName=${countryName}`);
    return result;
  } catch (error) {
    return error;
  }
};
const GetBankCategory = async () => {
  try {
    var result = await mainAxios.get(`${B2C_ENDPOINT.CATEGORY}/Banks`);
    return result;
  } catch (error) {
    return error;
  }
};


export const CategoryService = {
  GetBusinessCategory,
  GetProductOptions,
  GetBankCategory,
  GetCountryCategory,
  GetCountryByCountryName
};
