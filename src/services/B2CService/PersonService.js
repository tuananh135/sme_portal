import { identityAxios, mainAxios } from "common/axiosClient/AxiosClient";
import { B2C_ENDPOINT } from "common/constants/b2cEndpoint";
import { BACKEND_AUTH_URL } from "common/constants/identityEndpoint";
import React from "react";

const PostPersonWithFamilyMember = async (data) => {
  try {
    var result = await mainAxios.post(`${B2C_ENDPOINT.DOCUMENT}`, data);
    return result;
  } catch (error) {
    return error;
  }
};

const GetPersonById = async (id) => {
  try {
    var result = await mainAxios.get(`${B2C_ENDPOINT.PERSON}/${id}`);
    if (result.data && result.status === 200) {
      return result?.data;
    }
  } catch (error) {
    return null;
  }
};

const DeletePerson = async (id) => {
  try {
    var result = await mainAxios.delete(`${B2C_ENDPOINT.PERSON}/${id}`);
    if (result.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const DeletePersonByGroupId = async (id) => {
  try {
    var result = await mainAxios.delete(`${B2C_ENDPOINT.PERSON}`, {
      params: { groupId: id },
    });
    if (result.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const CheckEmployeeNotExist = async (stringToCheck, type, groupId) => {
  if (!stringToCheck) {
    return false;
  }
  const result = await mainAxios.get(
    `${B2C_ENDPOINT.PERSON}/CheckExistForEmployee`,
    {
      params: { stringToCheck: stringToCheck, type: type, groupId: groupId },
    }
  );
  if (result?.status === 200 && result.data) return true;
  return false;
};

export const PersonService = {
  PostPersonWithFamilyMember,
  GetPersonById,
  DeletePerson,
  DeletePersonByGroupId,
  CheckEmployeeNotExist,
};
