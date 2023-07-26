import { mainAxios } from "common/axiosClient/AxiosClient";
import { B2C_ENDPOINT } from "common/constants/b2cEndpoint";
import React from "react";

const GetSuggestionByBudget = async (data, type) => {
  try {
    var result = await mainAxios.get(
      `${B2C_ENDPOINT.BUDGET}/CombinationByBudgets`,
      {
        params: {
          budgetListString: data,
          type: type,
        },
      }
    );
    return result;
  } catch (error) {
    return error;
  }
};

const GetNewBudgetOnChange = async (data) => {
  try {
    var result = await mainAxios.post(
      `${B2C_ENDPOINT.BUDGET}/NewCombinations`,
      data
    );
    return result;
  } catch (error) {
    return error;
  }
};

const UpdateBugdetDetail = async (data) => {
  try {
    var result = await mainAxios.post(
      `${B2C_ENDPOINT.BUDGET}/UpdateBudgetDetail`,
      data
    );
    return result;
  } catch (error) {
    return error;
  }
};

const SaveQuote = async (data) => {
  try {
    var result = await mainAxios.post(
      `${B2C_ENDPOINT.BUDGET}/SaveQuotes`,
      data
    );
    return result;
  } catch (error) {
    return error;
  }
};

const LoadDaftQuote = async (data) => {
  try {
    var result = await mainAxios.post(
      `${B2C_ENDPOINT.BUDGET}/LoadDaftQuote?userId=${data}`
    );
    return result;
  } catch (error) {
    return error;
  }
};

const SaveDaftQuote = async (data) => {
  try {
    var result = await mainAxios.post(
      `${B2C_ENDPOINT.BUDGET}/SaveDaftQuote`, data
    );
    return result;
  } catch (error) {
    return error;
  }
};

const GetCombiByEmpGroup = async (empGroupId) => {
  try {
    var result = await mainAxios.get(
      `${B2C_ENDPOINT.BUDGET_DETAIL}/GetCombiByEmpGroup`,
      {
        params: {
          empGroupId,
        },
      }
    );
    return result;
  } catch (error) {
    return error;
  }
};

const RemoveGTL = async (groupId) => {
  return await mainAxios
    .post(`${B2C_ENDPOINT.BUDGET}/RemoveGTL/${groupId}`)
    .then((res) => {
      if (res?.status === 200) {
        return res;
      }
      return null;
    });
};

export const BudgetService = {
  GetSuggestionByBudget,
  GetNewBudgetOnChange,
  GetCombiByEmpGroup,
  SaveQuote,
  LoadDaftQuote,
  SaveDaftQuote,
  RemoveGTL,
  UpdateBugdetDetail
};
