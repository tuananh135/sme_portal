import moment from "moment";
import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmployeeGroupService } from "services/B2CService/EmployeeGroupService";

export const EmpGroupDispatchContext = createContext();
export const EmpGroupStateContext = createContext();

export const EmpGroupDataProvider = ({ children }) => {
  const [empGroupData, setEmpGroupData] = useState(null);
  const [empGroupID, setEmpGroupID] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    async function fetchEmpGroupData() {
        let response = await EmployeeGroupService.GetEmployeeGroupByID(empGroupID);
        console.log("ClientSection",response);
        const empdata = {...response.data, yearOfEstablish: response.data?.yearOfEstablish ? moment(response.data?.yearOfEstablish) : null};
        setEmpGroupData(empdata);
      }
      empGroupID && fetchEmpGroupData();
    }, [empGroupID]);  

  useEffect(() => {
    console.log(empGroupData)
  }, [empGroupData])
  
  const updateEmpGroupData = (value) => {
    setEmpGroupData(value);
  };

  const updateEmpGroupID = (value) => {
    setEmpGroupID(value);
  };

  return (
    <EmpGroupStateContext.Provider
      value={{
        empGroupData,
        empGroupID
      }}
    >
      <EmpGroupDispatchContext.Provider
        value={{
            updateEmpGroupData,
            updateEmpGroupID
        }}
      >
        {children}
      </EmpGroupDispatchContext.Provider>
    </EmpGroupStateContext.Provider>
  );
};