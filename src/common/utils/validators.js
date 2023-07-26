import { REGEX } from "common/constants/constants";
import moment from "moment";
import { ReactComponent as ErrorIcon } from "assets/images/icon-error-small.svg";
import React from 'react';
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";
import { MEMBER_ERRORS } from "common/constants/membersCheckingError";

export const RegexValidator = (_, value, regexTemplate) => {
  if (regexTemplate.test(value) ||!value) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
};

export const DateOfBirthValidator = (_, value, dateFormat) => {
  if (value && moment(value, dateFormat,true).isValid()) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
};

export const IsFomDataValid = async(form) => {
  try{
    await form.validateFields();
    return true;
  }catch(err){
    return false;
  }
};

export const SanctionValidator = async(_, value, countryName ) => {
  if(countryName === undefined || countryName === null) return; // countryName is mandatory
  var message = "";
  var nric ="";
  var passport="";
  var name = "";
  if(_.field === "nric") nric = value;
  if(_.field === "passport") passport = value;
  if(_.field === "name") name = value;
 
  const sanctionModel =[{
    "nric": nric,
    "passport": passport,
    "customerName": name,
    "index": 0,
    "country": countryName
  }];

  const sanctionChecking = await EmployeeGroupService.CheckXlsxBlackList(sanctionModel);
 
  if (sanctionChecking) {
  sanctionChecking.forEach((item) => {
    if (item.countrySanctioned && _.field === "nationality") {
      message=MEMBER_ERRORS.COUNTRY_SANCTION.LONG
    }
    if (item.nameSanctioned && _.field === "name") {
      message=MEMBER_ERRORS.NAME_SANCTION.LONG
    }
    if (item.nricSanctioned && _.field === "nric") {
      message=MEMBER_ERRORS.NRIC_SANCTION.LONG
    }
    if (item.passportSanctioned && _.field === "passport") {
      message=MEMBER_ERRORS.PASSPORT_SANCTION.LONG
    }
  });
}

  if(message !== ""){
    return Promise.reject(message);
  }
  else{
    return Promise.resolve();
  }
};
