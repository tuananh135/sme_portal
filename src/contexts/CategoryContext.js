import React, { createContext, useEffect, useState } from "react";
import { CategoryService } from "services/B2CService/CategoryService";

export const CategoryStateContext = createContext();

export const CategoryDataProvider = ({ children }) => {
  const [countryList, setCountryList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [industryList, setIndustryList] = useState([]);

  useEffect(() => {
    Promise.allSettled([getBank(), getCountry(), getIndustry()]);
    }, []);  

    const getBank = async () => {
      const result = await CategoryService.GetBankCategory();
      if (result.data?.length > 0) {
        setBankList(result.data);
      }
    };
  
    const getCountry = async () => {
      const result = await CategoryService.GetCountryCategory();
      if (result.data?.length > 0) {
        setCountryList(result.data);
      }
    };

    const getIndustry = async () => {
      const result = await CategoryService.GetBusinessCategory();
      if (result.data?.length > 0) {
        const sortedList = result.data.sort((a, b) => a.industry_Nm.localeCompare(b.industry_Nm));
        setIndustryList(sortedList);
      };
    };
  return (
    <CategoryStateContext.Provider
      value={{
        bankList,
        countryList,
        industryList
      }}
    >
        {children}
    </CategoryStateContext.Provider>
  );
};