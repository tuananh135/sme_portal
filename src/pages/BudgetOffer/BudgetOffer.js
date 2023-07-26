import ChatIcon from "common/components/ChatIcon/ChatIcon";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "react-circular-progressbar/dist/styles.css";
import OfferInfo from "./components/OfferInfo";
import { Button, Col, Row, notification } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import SaveQuoteModal from "common/components/Modal/SaveQuoteModal";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import OfferDetail from "./OfferDetailModal";
import { PAGE_LINK } from "common/constants/pagelinks";
import { AuthContext, AuthDispatchContext } from "contexts/AuthContext";
import PrimaryButton from "common/components/Button/PrimaryButton";
import ListOfBenefitModal from "./components/ListOfBenefitModal";
import { CategoryService } from "services/B2CService/CategoryService";
import { BusinessService } from "services/B2CService/BusinessDetailService";
import { BudgetService } from "services/B2CService/BudgetService";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  @media only screen and (min-width: 768px) {
    padding-left: 25%;
    padding-right: 25%;
  }
`;
const PageText = styled.div`
  font-weight: bold;
  text-align: center;
  color: white;
  margin-top: 20px;
`;

const BottomButton = styled.div`
  min-height: 50px;
  padding:12px;
  position: fixed;
  bottom: 0px;
  display: flex;
  z-index: 1000;
  width:100%;
  justify-content:center;
`;

function BudgetOffer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [rankList, setRankList] = useState(location?.state?.suggestionData || []);
  const [coverType, setCoverType] = useState(location?.state?.coverType);
  const [budgetString, setBudgetString] = useState(location?.state?.budgetString);
  const [productInfo, setProductInfo] = useState([]);
  const [showFullBenefitModal, setShowFullBenefitModal] = useState(false);
  const [isShowQuoteModal, setIsShowQuoteModal] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isShowModifyOfferModal, setIsShowModifyOfferModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const { isLoggedIn, getUser, signinRedirect } = React.useContext(AuthDispatchContext);
  const { currentUser } = React.useContext(AuthContext);

  useEffect(() => {
    Promise.all([loadExistQuote()]);
    getProductOptions();
    getUser();
  }, []);

  const getProductOptions = async () => {
    const result = await CategoryService.GetProductOptions();
    if (result.data?.length > 0) {
      setProductInfo(result.data);
    }
  };

  const loadExistQuote = async () => {
    const isUserLoggedIn = await isLoggedIn();
    var id = searchParams.get("draftId");
    var daftQuote;

    if (id && !isUserLoggedIn) { // id user, load older quote
      signinRedirect();
      return;
    }

    if (isUserLoggedIn) {
      // auto redirect
      if (localStorage.getItem("budgetOffer.nextPage") === 'true') {
        localStorage.removeItem("budgetOffer.nextPage");
        await onProcess(false);
        return;
      }
      // auto load older quote
      var currentUser = await getUser();
      daftQuote = await BudgetService.LoadDaftQuote(currentUser.profile.id);
      if (localStorage.getItem("budgetOffer.override") !== 'true'
        && daftQuote?.data?.data?.id) {
        await loadDataFromDbToCache(daftQuote.data.data);
      }

      if (localStorage.getItem("budgetOffer.override") === 'true') {
        await saveDraftQuote();
      }
    }
    await loadDataFromCacheToScreen();
  }

  const saveDraftQuote = async (isSend = true, user = null) => {
    // save daft quote
    var currentId;
    var currentEmail;

    if (user != null) {
      currentId = user.data.id;
      currentEmail = user.data.email;
    }
    else{
      var currentUser = await getUser();
      currentId = currentUser.profile.id;
      currentEmail = currentUser.profile.email;
    }

    var sendEmail = localStorage.getItem("budgetOffer.notification");
    var requestData = {
      coverType: localStorage.getItem("coverType.type"),
      budgetString: localStorage.getItem('budgetPerEmployee.budgetString'),
      numberOfEmpRef: localStorage.getItem("welcome.numberOfEmpRef"),
      budgetStartDate: localStorage.getItem('effectiveDate.dateString'),
      overrideExist: true,
      emailNotification: isSend,
      userId: currentId,
      email: currentEmail,
    };
    if (sendEmail === 'true') {
      localStorage.removeItem("budgetOffer.notification");
    }
    var saveDraft = await BudgetService.SaveDaftQuote(requestData);
    if (saveDraft?.status === 200 && saveDraft?.data?.code === 200) {
      localStorage.removeItem("budgetOffer.override");
      return true;
    }

    notification.error({
      message: 'There was an error during the save draft process.',
    });
    return false;
  }

  const loadDataFromCacheToScreen = async () => {
    const suggestion = await BudgetService.GetSuggestionByBudget(
      localStorage.getItem("budgetPerEmployee.budgetString"),
      localStorage.getItem('coverType.type')
    );
    localStorage.setItem('budgetPerEmployee.suggestionData', JSON.stringify(suggestion.data));
    let isGtlList = []
      
    suggestion.data.forEach((element, index) => {
      let combiNo = element.combiNo;
      if(element.ghsPlan === 'Plan0' && element.gpspPlan === 'Plan0' && element.gtl !== 'D0'){
        let data = {comboNo :combiNo, status : true }
        isGtlList.push(data);
      }else{
        let data = {comboNo :combiNo, status : false }
        isGtlList.push(data);
      }
      localStorage.setItem('isGTLOnly', JSON.stringify(isGtlList));
 });
   
    setCoverType(localStorage.getItem('coverType.type'));
    setBudgetString(localStorage.getItem("budgetPerEmployee.budgetString"));
    setRankList(suggestion.data);
  }

  const loadDataFromDbToCache = async (emp) => {
    if (!emp.numberOfEmployee
      && !emp.budgetString
      && !emp.budgetCoverType
      && !emp.budgetStartDate
    ) return;
    localStorage.setItem("welcome.numberOfEmpRef", emp.numberOfEmployee ?? 0);
    localStorage.setItem("budgetPerEmployee.budgetString", emp.budgetString);
    localStorage.setItem('coverType.type', emp.budgetCoverType);
    localStorage.setItem('effectiveDate.dateString', emp.budgetStartDate);
  }

  const handleRedirectLogin = () => {
    signinRedirect();
  }

  const onSaveQuote = async () => {
    localStorage.setItem("budgetOffer.currentRankData", JSON.stringify({
      type: localStorage.getItem("coverType.type"), data: localStorage.getItem("budgetPerEmployee.suggestionData") ?
        JSON.parse(localStorage.getItem("budgetPerEmployee.suggestionData")) : []
    }));
    localStorage.setItem("budgetOffer.override", true);
    localStorage.setItem("budgetOffer.notification", true);

    const isUserLoggedIn = await isLoggedIn();
    if (!isUserLoggedIn) {
      setIsShowQuoteModal(true);
      setIsLogin(false);
      return;
    }
    var isSaved = await saveDraftQuote();
    if (isSaved) {
      setIsShowQuoteModal(true);
      setIsLogin(true);
      return;
    }
  };

  const onProcess = async (autoRedirect = true) => {
    localStorage.setItem("budgetOffer.currentRankData", JSON.stringify({
      type: localStorage.getItem("coverType.type"), data: localStorage.getItem("budgetPerEmployee.suggestionData") ?
        JSON.parse(localStorage.getItem("budgetPerEmployee.suggestionData")) : []
    }));
    if (autoRedirect) localStorage.setItem("budgetOffer.nextPage", true);
    const isUserLoggedIn = await isLoggedIn();
    if (!isUserLoggedIn) {
      setIsShowQuoteModal(true);
      setIsLogin(false);
      return;
    }

    var isSaved = await saveDraftQuote(false);
    if (!isSaved) return;
    var currentUser = await getUser();
    var employeeGroup = await BusinessService.SearchEmployeeGroupNotFinish(currentUser.profile.id);
    if (employeeGroup?.data?.data?.id) {
      navigate(`${PAGE_LINK.BUSINESS_DETAIL.NAME}/${employeeGroup.data.data.id}`);
    }
    navigate(`${PAGE_LINK.BUSINESS_DETAIL.NAME}`);
  };

  return !currentUser && !!searchParams.get("autologin") ? signinRedirect() :
    (<Wrapper>
      <ChatIcon pageName="budgetOffer" width={50} />
      <>
        <PageText className="text-x-large">
          Here you go! This offer is the best suit for your budget.
        </PageText>
        <Row>
          <PageText className="text-x-medium">Not happy? You still can customise your plan to suit your need!</PageText>
        </Row>
        <StepProgressTrigger/>
        <Row className="w-100">
          {rankList?.map((item, index) => (
            <Col span={24} lg={12}>
              <OfferInfo
                key={index}
                employeeRank={item}
                setShowModifyModal={setIsShowModifyOfferModal}
                index={index}
                setCurrentIndex={setCurrentIndex}
                productInfo={productInfo}
              />
            </Col>
          ))}
        </Row>
        <div style={{ height: "150px", justifyContent: "space-around" }} className="w-100 d-flex">
          <Button
            className="background-main text-white text-x-small border-bg "
            onClick={() => setShowFullBenefitModal(true)}
          >
            <SaveOutlined style={{ fontSize: "1.5em" }} />
            See full benefits
          </Button>
          <Button
            className="background-main text-white text-x-small border-bg "
            onClick={() => onSaveQuote(true)}
          >
            <SaveOutlined style={{ fontSize: "1.5em" }} />
            Save Quote
          </Button>
        </div>
        <BottomButton className="background-main">
          <PrimaryButton
            text="Next"
            rootclass="w-50 max-width-button"
            onClick={() => onProcess()}
          />
        </BottomButton>
        <SaveQuoteModal
          show={isShowQuoteModal}
          setShow={setIsShowQuoteModal}
          nextPage={handleRedirectLogin}
          isLogin={isLogin}
          setLogin={setIsLogin}
          saveQuote={saveDraftQuote}
        />
        <OfferDetail
          show={isShowModifyOfferModal}
          setShow={setIsShowModifyOfferModal}
          data={rankList ? rankList[currentIndex] : null}
          productInfo={productInfo}
          coverType={coverType}
          currentIndex={currentIndex}
          budgetString={budgetString}
          rankList={rankList}
          setRankList={setRankList}
        />

        <ListOfBenefitModal show={showFullBenefitModal} setShow={setShowFullBenefitModal} />
      </>
    </Wrapper>
  );
}

export default BudgetOffer;
