import { identityAxios, mainAxios } from "common/axiosClient/AxiosClient";
import { B2C_ENDPOINT } from "common/constants/b2cEndpoint";
import { BACKEND_AUTH_URL } from "common/constants/identityEndpoint";
import React from "react";

const GetEmployeeGroupByID = async (id) => {
  return await mainAxios
    .get(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/Details/${id}`)
    .then((res) => {
      if (res?.status === 200) {
        return res;
      }
      return null;
    })
    .catch((ex) => {
      return null;
    });
};

const GetDocByGroupID = async (id) => {
  try {
    var result = await mainAxios.get(
      `${B2C_ENDPOINT.FILE}/getFileByGroupId/${id}`
    );
    return result;
  } catch (error) {
    return error;
  }
};

const CheckUWQuestion = async (id) => {
  return await mainAxios.get(
    `${B2C_ENDPOINT.EMPLOYEE_GROUP}/UWQuestionStatus`,
    {
      params: { groupid: id },
    }
  );
};

const PostPersonWithMemberDetails = async (data) => {
  return await mainAxios
    .post(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/DirectorsDetail`, data)
    .then((res) => {
      if (res?.status === 200) {
        return res;
      }
      return null;
    });
};

const PutPersonDetails = async (data) => {
  return await mainAxios
    .put(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/PersonDetail`, data)
    .then((res) => {
      if (res?.status === 200) {
        return res;
      }
      return null;
    });
};

const PostPersonDetails = async (data) => {
  return await mainAxios
    .post(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/PersonDetails`, data)
    .then((res) => {
      if (res?.status === 200) {
        return res?.data;
      }
      return null;
    }).catch(error => {return null});
};

const GetPersonByType = async (type, groupid) => {
  return await mainAxios.get(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/DirectorsDetail`, {
    params: { type: type, groupid: groupid },
  });
};

const GetAuthorisationInfo = async (query) => {
  return await mainAxios
    .get(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/GetAuthorisationInfo/${query}`)
    .then((res) => {
      if (res?.status === 200) {
        return res.data;
      }
      return null;
    });
};

const CheckCanProcessPayment = async (groupid) => {
  return await mainAxios.get(
    `${B2C_ENDPOINT.EMPLOYEE_GROUP}/CheckCanProcessPayment`,
    {
      params: { groupid: groupid },
    }
  );
};

const SendEmailToDirector = async (groupid, empGroupData, directorEmail) => {
  const data = {
    id: groupid,
    directors: directorEmail?.map((d) => ({ name: d.name, email: d.email })),
  };
  return await mainAxios
    .post(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/AuthorisationRequestGroup`, data)
    .then((res) => {
      if (res?.status === 200) {
        return res;
      }
      return null;
    });
};

const SendInvitationToEmployee = async (emails, groupId) => {
  return await mainAxios
    .post(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/SendInvitationToEmployee`, {
      EmailTo: emails,
      groupId: groupId,
    })
    .then((res) => {
      if (res?.status === 200) {
        return res;
      }
      return null;
    });
};

const ResendInvitation = async (emails, groupId) => {
  return await mainAxios
    .post(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/ResendInviation`, {
      EmailTo: emails,
      groupId: groupId,
    })
    .then((res) => {
      if (res?.status === 200) {
        return res;
      }
      return null;
    });
};

const CheckXlsxBlackList = async (data) => {
  return await mainAxios
    .post(`${B2C_ENDPOINT.BLACK_LIST}/XlsxSanction`, data)
    .then((res) => {
      if (res?.status === 200) {
        return res.data;
      }
      return null;
    });
};

const CheckBlackList = async (data) => {
  return await mainAxios
    .post(`${B2C_ENDPOINT.BLACK_LIST}/checkNotInBlacklist`, data)
    .then((res) => {
      if (res?.status === 200) {
        return res.data;
      }
      return null;
    });
};

const UpdateAuthorisationStatus = async (id, newStatus, directorEmail, directorName) => {
  try {
    var result = await mainAxios.patch(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/UpdateAuthorisationStatus`, {},
    {
      params: {id: id, newStatus: newStatus, email:directorEmail, directorName: directorEmail},
    });
    if (result.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const AgreeVerifyByCTO = async (id) => {
  try {
    var result = await mainAxios.patch(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/AgreeVerifyByCTO/${id}`);
    if (result.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const AgreeTermAndCondition = async (id) => {
  try {
    var result = await mainAxios.patch(`${B2C_ENDPOINT.EMPLOYEE_GROUP}/AgreeTermAndCondition/${id}`);
    if (result.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const EmployeeGroupService = {
  GetEmployeeGroupByID,
  GetDocByGroupID,
  PostPersonWithMemberDetails,
  GetPersonByType,
  SendEmailToDirector,
  PostPersonDetails,
  SendInvitationToEmployee,
  PutPersonDetails,
  CheckUWQuestion,
  ResendInvitation,
  CheckCanProcessPayment,
  CheckXlsxBlackList,
  CheckBlackList,
  GetAuthorisationInfo,
  UpdateAuthorisationStatus,
  AgreeVerifyByCTO,
  AgreeTermAndCondition
};
