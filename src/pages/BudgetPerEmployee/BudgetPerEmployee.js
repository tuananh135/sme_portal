import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GreetingScreen from "./components/GreetingScreen";
import BudgetInput from "./components/BudgetInput";
import CoverType from "./components/CoverType";
import { BudgetService } from "services/B2CService/BudgetService";
import { NotificationDispatchContext } from "contexts/NotificationContext";
import { PAGE_LINK } from "common/constants/pagelinks";
import styled from "styled-components";
import { SpinnerCircular } from "spinners-react";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import EffectiveDate from "./components/EffectiveDate";

const PageText = styled.div`
  font-weight: bold;
  text-align: center;
  color: white;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const SpinnerText = styled.div`
  justify-content: center;
  color: white;
  font-size: 10px;
  color: white;
`;

const Spinner = styled(SpinnerCircular)`
  color: #ff2626 !important;
  overflow: visible !important;
  width: 60px !important;
`;

function BudgetPerEmployee() {
  const { updateNotification } = useContext(NotificationDispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowingGreeting, setIsShowingGreeting] = useState(false);
  const [isChoosingRank, setIsChoosingRank] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [budgetSource, setBudgetList] = useState([]);
  const [isEffectiveDateStep, setEffectiveDateStep] = useState(false);
  const [typeOfSubmit, setTypeOfSubmit] = useState(0);
  const navigate = useNavigate();

  const gotoEffectiveDate = async (type) => {
    setTypeOfSubmit(type);
    setEffectiveDateStep(true);
    await saveCacheRequire();
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setIsShowingGreeting(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isShowingGreeting) {
      setTimeout(() => {
        setIsShowingGreeting(false);
      }, 2000);
    }
  }, [isShowingGreeting]);

  const nextStep = async () => {
   
    
    const result = await saveCacheRequire();

    if (result.data == undefined) {
      updateNotification([
        {
          id: Math.random(),
          message: "Sorry, we do not have any plan that matches this budget!",
          types: "error",
        },
      ]);
      return;
    }

    setIsChoosingRank(false);
  };

  const saveCacheRequire = async () => {
    localStorage.setItem("budgetPerEmployee.budgetString", budgetSource.map(b=> b.value).join());
    localStorage.setItem("budgetOffer.override", true);
    const result = await BudgetService.GetSuggestionByBudget(budgetSource.map(b=> b.value).join(), typeOfSubmit);
    if (result.data?.length > 0) {
      localStorage.setItem('budgetPerEmployee.suggestionData', JSON.stringify(result.data));
      
      let isGtlList = [];
      result.data.forEach((element, index) => {
        let combiNo = element.combiNo;
        if (element.ghsPlan === 'Plan0' && element.gpspPlan === 'Plan0' && element.gtl !== 'D0') {
          let data = {comboNo :combiNo, status : true }
          isGtlList.push(data);
        }else{
          let data = {comboNo :combiNo, status : false }
          isGtlList.push(data);
        }
      });
      localStorage.setItem('isGTLOnly', JSON.stringify(isGtlList));
    }
    
    return result;
  }

  const onSubmit=async(type)=>{
    setIsAnalyzing(true);
    try {
      const result = await saveCacheRequire();
      if (result.data?.length > 0) {
        navigate(PAGE_LINK.BUDGET_OFFER.NAME,{
          state: { 
            suggestionData: result.data, 
            coverType: type, 
            budgetString: budgetSource.map(b=> b.value).join()
          },
        })
      }
      else{
        updateNotification([
          {
            id: Math.random(),
            message: "Can't find any combination with budget and type!",
            types: "error",
          },
        ]);
        setIsChoosingRank(true);
      }
    } catch (error) {
    }
    finally{
      setIsAnalyzing(false);
    }
  }

  return (
    <>
      <GreetingScreen
        isLoading={isLoading}
        isShowingGreeting={isShowingGreeting}
      />
      { !isEffectiveDateStep ?
       (!isLoading && !isShowingGreeting && !isAnalyzing && (isChoosingRank ? <BudgetInput nextStep={nextStep} budgetInputHandler={[budgetSource, setBudgetList]}/> : <CoverType onSubmit={gotoEffectiveDate}/>))
        : (!isLoading && !isShowingGreeting && !isAnalyzing && <EffectiveDate onSubmit={() => onSubmit(typeOfSubmit)}/>)
      }
      {isAnalyzing ? 
        <div className="center-items d-flex-c">
          <ChatIcon width={50} />
          <PageText className="text-x-large ">
            Please wait,
            <br />
            we are churning out better plan for you
          </PageText>
          <Spinner сolor="#ff2626" secondaryColor="#843d47" thickness={250} />
          <SpinnerText>Analysing...</SpinnerText>
        </div>:<></>}
    </>
  );
}

export default BudgetPerEmployee;
