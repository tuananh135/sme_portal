import { BudgetService } from "services/B2CService/BudgetService";
export const GetMedicalFixedValue = (data) => {
    switch (data) {
      case "Plan0":
        return ["RM 90", "RM 100"];
      case "Plan1":
        return ["RM 150", "RM 100"];
      case "Plan2":
        return ["RM 200", "RM 200"];
      case "Plan3":
        return ["RM 250", "RM 200"];
      case "Plan4":
        return ["RM 350", "RM 200"];
      case "Plan5":
        return ["RM 500", "RM 200"];
      default:
        return ["RM 0", "RM 0"];
    }
  };

  export const GetDailyRoomAndBoard = (data) => {
    switch (data) {
      case "Plan1":
        return "RM 90";
      case "Plan2":
        return "RM 150";
      case "Plan3":
        return "RM 200";
      case "Plan4":
        return "RM 250";
      default:
        return "RM 0";
    }
  };

  export const ghs_GetAnnualLimitValue = (data) => {
    switch (data) {
      case "Plan1":
        return "RM 20,000";
      case "Plan2":
        return "RM 40,000";
      case "Plan3":
        return "RM 50,000";
      case "Plan4":
        return "RM 100,000";
      default:
        return "RM 0";
    }
  };

  export const activ8_GetAnnualLimitValue = (data) => {
    switch (data) {
      case "Plan1":
        return "RM 20,000";
      case "Plan2":
        return "RM 40,000";
      case "Plan3":
        return "RM 50,000";
      case "Plan4":
        return "RM 100,000";
      default:
        return "RM 0";
    }
  };

  export const sp_GetAnnualLimitValue = (data) => {
    switch (data) {
      case "Plan1":
        return "RM 1,000";
      case "Plan2":
        return "RM 2,000";
      default:
        return "RM 0";
    }
  };

  export const gp_GetAnnualLimitValue = (data) => {
    switch (data) {
      case "Plan1":
        return "Unlimited";
      case "Plan2":
        return "Unlimited";
      default:
        return "RM 0";
    }
  };


  export const gtl_GetAnnualLimitValue = (data) => {
    switch (data) {
      case "D25":
        return "RM 25,000";
      case "D50":
        return "RM 50,000";
      case "D100":
        return "RM 100,000";
      case "D150":
        return "RM 150,000";
      default:
        return "RM 0";
    }
  };

  export const get_StampDuty = (data) => {
    if(data === undefined) return;
    let isGhs = false;
    let isGPSP = false;
    let isGTL = false;
  
    if (data.ghsPlan !== 'Plan0') isGhs = true;
    if (data.gpspPlan !== 'Plan0') isGPSP = true;
    if (data.gtl !== 'D0') isGTL = true;
  
    if (isGhs === true && isGPSP === true && isGTL === true) {
      return 20;
    } else if (isGhs === true && isGPSP === true && isGTL === false) {
      return 10;
    } else if (isGhs === false && isGPSP === false && isGTL === true) {
      return 10;
    } else if (isGhs === true && isGPSP === false && isGTL === true) {
      return 20;
    } else if (isGhs === true && isGPSP === false && isGTL === false) {
      return 10;
    } else {
      return 0;
    }
  };

  export const GetNewCombiForEmployeeWithDependentAndFamily = async (coverType, combiData) => {
    try {
      let data = combiData.budgetBasedData;
      const dataList = [
        {
          BudgetType: coverType,
          GHSType: data.ghsType,
          GHSPlan: data.ghsPlan,
          GPSPType: data.gpspType,
          GPSPPlan: data.gpspPlan,
          GTL: data.gtl,
          CurrentIndex: 0,
          IsResetOthers: false,
          IsUpdateGHSFromZero: false,
          IsUpdateGPSPFromZero: false,
          IsUpdateGTLFromZero: false
        },
      ];

      const result = await BudgetService.GetNewBudgetOnChange(dataList);
      if (result.data && result.data.length > 0) {
        console.log("GetCombiByCoverType", result.data);
        return result.data;
      }
      return null;
    } catch (error) {
      // Handle the error
      console.error('Error in GetCombiByCoverType:', error);
      return null;
    }
  };
  
  export const calculateTotalPremium = async (combinationData, empData) => {
    let rank = 0;
    let stampduty = 0;
    let sst = 0;
    let totalMcoFee = 0;
    let totalGhs8WellnessFee = 0;
    let mcoFees = 0;
    let wellnessFee = 0;

    let totalEmp = 0;
    let totalDependent = 0; //total family/spouse/child
    let totalEmpWithOutDep = 0; //total employee only
    let totalEmpWithFamily = 0; //total employee with spouse AND child
    let totalDep_Family = 0; //total dependent under family
    let totalEmpPlus = 0; //total employee with spouse OR Child 
    let totalDep_Plus = 0; //total dependent under employeePlus
    let totalEmpWithDep = 0; //totalEmpWithFamily + totalEmpPlus

    let totalghs = 0;
    let totalgpsp = 0;
    let totalgtl = 0;

    let premiumNettEmployee = 0; //premium for employee only
    let premiumNettEmployeePlus = 0; //premium for employee + spouse OR child
    let premiumNettFamily = 0; //premium for employee + spouse AND child

    let totalPremiumNettEmployee = 0; //total premium for total employee only
    let totalPremiumNettEmployeePlus = 0; //total premium for total employee + spouse OR child
    let totalPremiumNettFamily = 0; //total premium for total employee + spouse AND child

    let totalPremiumNettAll = 0; //total premium for all

    const values = []; // Create an empty array for values
    for (const combiData of combinationData) {
      const employee = empData.filter((e) => e.rank === combiData.rank);
      totalEmp = employee.length;
      totalDependent = employee.map((emp) => emp.dependents.length).reduce((acc, val) => acc + val, 0);
      totalEmpWithOutDep = employee.filter((e) => e.dependents.length === 0).length;
      totalEmpWithDep = employee.filter((e) => e.dependents.length > 0).length;

      const employeesWithSpouseDependents = employee.filter((employee) => {
        const spouseDependents = employee.dependents.filter((dependent) => dependent.relationship === "Spouse");
        return employee.dependents.length > 0 && spouseDependents.length === employee.dependents.length;
      });
      const spouseDependentCount = employeesWithSpouseDependents.map((emp) => emp.dependents.length).reduce((acc, val) => acc + val, 0);
  
      const employeesWithChildDependents = employee.filter((employee) => {
        const childDependents = employee.dependents.filter((dependent) => dependent.relationship === "Child");
        return employee.dependents.length > 0 && childDependents.length === employee.dependents.length;
      });

      const childDependentCount = employeesWithSpouseDependents.map((emp) => emp.dependents.length).reduce((acc, val) => acc + val, 0);
      
      totalEmpPlus = employeesWithSpouseDependents.length + employeesWithChildDependents.length
      totalDep_Plus = spouseDependentCount + childDependentCount;
      let EmpWithFamily = employee.filter((employee) => {
        const spouseDependents = employee.dependents.some((dependent) => dependent.relationship === "Spouse");
        const childDependents = employee.dependents.some((dependent) => dependent.relationship === "Child");
        return spouseDependents && childDependents;
      });
      totalEmpWithFamily = EmpWithFamily.length;
      totalDep_Family = EmpWithFamily.map((emp) => emp.dependents.length).reduce((acc, val) => acc + val, 0);

      let newCombi = null;
      let newCombiForEmp = null;
      let newCombiForEmpPlus = null;
      let newCombiForFamily = null;
      newCombi = await GetNewCombiForEmployeeWithDependentAndFamily(3,combiData);
      newCombiForEmp =  newCombi.filter(item => item.dependentStatus == null);
      if(newCombiForEmp.length>0){
      premiumNettEmployee =  parseFloat(newCombiForEmp[0]?.premiumNett)||0;
      totalghs = parseFloat(newCombiForEmp[0]?.ghsNett) * totalEmpWithOutDep;
      totalgpsp = parseFloat(newCombiForEmp[0]?.gpspNett)*totalEmpWithOutDep;
      totalgtl = parseFloat(newCombiForEmp[0]?.gtlNett) * totalEmpWithOutDep
      totalPremiumNettEmployee = totalghs+totalgpsp+totalgtl;
      }
      let gtlOnlywithDependent = false;

      if(totalDependent>0){
        if(combiData.budgetBasedData?.ghsPlan === 'Plan0' && combiData.budgetBasedData?.gpspPlan === 'Plan0'  && combiData.budgetBasedData?.gtl !== 'D0' ){
          gtlOnlywithDependent = true; //true if plan not valid. remove dependent
          totalEmpWithOutDep = totalEmp;
          totalEmpWithFamily = 0;
          totalEmpPlus = 0;
          totalPremiumNettEmployee = totalEmpWithOutDep * premiumNettEmployee;
        }
      
        if(!gtlOnlywithDependent){
        
        if(newCombi && totalEmpWithFamily>0){
          newCombiForFamily = newCombi.filter(item => item.dependentStatus === 'Family');
          if(newCombiForFamily.length>0){
          premiumNettFamily = parseFloat(newCombiForFamily[0]?.premiumNett)||0;
          let totalHead = totalEmpWithFamily + totalDep_Family;
          totalghs = parseFloat(newCombiForFamily[0]?.ghsNett) * totalEmpWithFamily;
          totalgpsp = parseFloat(newCombiForFamily[0]?.gpspNett)*totalHead;
          totalgtl = parseFloat(newCombiForFamily[0]?.gtlNett) * totalEmpWithFamily
          totalPremiumNettFamily = totalghs+totalgpsp+totalgtl;
          }
        }
        if(newCombi && totalEmpPlus>0){
          newCombiForEmpPlus = newCombi.filter((item) => {
            const dependentStatus = item.dependentStatus && item.dependentStatus.toLowerCase();
            return dependentStatus && (dependentStatus.includes('kid') || dependentStatus.includes('spouse'));
          });
          
          if(newCombiForEmpPlus.length>0){
          premiumNettEmployeePlus = parseFloat(newCombiForEmpPlus[0]?.premiumNett)||0;
          let totalHead = totalEmpPlus + totalDep_Plus;
          totalghs = parseFloat(newCombiForEmpPlus[0]?.ghsNett) * totalEmpPlus;
          totalgpsp = parseFloat(newCombiForEmpPlus[0]?.gpspNett)*totalHead;
          totalgtl = parseFloat(newCombiForEmpPlus[0]?.gtlNett) * totalEmpPlus
          totalPremiumNettEmployeePlus = totalghs+totalgpsp+totalgtl;
          }
        }
      }
    }

      totalPremiumNettAll = totalPremiumNettEmployee + totalPremiumNettEmployeePlus + totalPremiumNettFamily;
        
      rank = combiData.rank;
      mcoFees = parseFloat(combiData.budgetBasedData.mcoFees) || 0;
      wellnessFee = parseFloat(combiData.budgetBasedData.activ8Programm) || 0;
      stampduty = get_StampDuty(combiData.budgetBasedData);
      totalGhs8WellnessFee = totalEmp * wellnessFee;
      totalMcoFee = (totalEmp + totalDependent) * combiData.budgetBasedData.mcoFees;

      sst = (6 / 100) * totalPremiumNettAll;

      const value = {
        gtlOnlywithDependent,
        rank: rank,
        totalEmp: totalEmp,
        totalEmpWithFamily: totalEmpWithFamily, //spouse + kid
        totalEmpWithDep: totalEmpWithDep, //spouse or kid
        totalEmpPlus:totalEmpPlus,
        totalEmpWithOutDep: totalEmpWithOutDep,
        totaldependent: totalDependent,
        mcoFees: mcoFees.toFixed(2),
        wellnessFee: wellnessFee.toFixed(2),
        premiumNettEmployee: premiumNettEmployee.toFixed(2),
        totalPremiumNettEmployee: totalPremiumNettEmployee.toFixed(2),
        premiumNettEmployeePlus: premiumNettEmployeePlus.toFixed(2),
        totalPremiumNettEmployeePlus: totalPremiumNettEmployeePlus.toFixed(2),
        premiumNettFamily: premiumNettFamily.toFixed(2),
        totalPremiumNettFamily: totalPremiumNettFamily.toFixed(2),
        totalPremiumNettAll :totalPremiumNettAll.toFixed(2),
        totalMcoFee: totalMcoFee.toFixed(2),
        sst: sst.toFixed(2),
        stampduty: stampduty.toFixed(2),
        totalWellnessFee: totalGhs8WellnessFee.toFixed(2),
      };
  
      values.push(value); // Add value object to values array
    }
  
    return values;
  };
  
  