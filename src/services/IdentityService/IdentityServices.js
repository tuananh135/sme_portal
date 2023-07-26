import { identityAxios } from 'common/axiosClient/AxiosClient'
import { BACKEND_AUTH_URL } from 'common/constants/identityEndpoint'
import React from 'react'

const RegisterUser = async(user) =>{
    const result = await identityAxios.post(BACKEND_AUTH_URL.API_REGISTER_USER,{
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
        gender: "M",
        dob: "31/12/9999",
        name: user.email,
        firstName: user.email,
        lastName: user.email,
        roleId:"d637b639-1d9e-497e-808a-095fad4486f6",
        affiliateCode:user.affiliateCode
    })

    return result;
}

const ChangePassword = async(data) =>{
    const result = await identityAxios.post(BACKEND_AUTH_URL.API_UPDATE_PASSWORD,{
        "email": data.email,
        "token": data.token,
        "newPassword": data.newPassword,
        "confirmNewPassword": data.confirmNewPassword
      });
    if (result.status === 200) {
        return true;
    }
    return false;
}

export const IdentityService = {
    RegisterUser,
    ChangePassword
};