import "./App.less";
import React, { lazy, Suspense, useContext, useEffect, useState } from "react";

import { Route, Routes } from "react-router-dom";
import Spinner from "common/components/Spinner/Spinner";
import { notification } from "antd";
import { PAGE_LINK } from "common/constants/pagelinks";
import PaymentFailed from "pages/Payment/components/PaymentFailed";
import SuccessReloadKYC from "pages/IdentityVerify/components/SuccessReloadKYC";
const Main = lazy(() => import("pages/Main"));
const Welcome = lazy(() => import("pages/Welcome/Welcome"));
const DetailInfo = lazy(() => import("pages/DetailWelcome/DetailInfo"));
const CoverType = lazy(() => import("pages/CoverType/CoverType"));
const BudgetOffer = lazy(() => import("pages/BudgetOffer/BudgetOffer"));
const Contact = lazy(() => import("pages/ContactSupport/Contact"));
const BudgetPerEmployee = lazy(() =>
  import("pages/BudgetPerEmployee/BudgetPerEmployee")
);
const BusinessBriefInfo = lazy(() =>
  import("pages/BusinessBriefInfo/BusinessBriefInfo")
);
// const PersonalDetail = lazy(() => import("pages/PersonDetail/PersonDetail"));
const UploadExcel = lazy(() => import("pages/UploadExcel/UploadExcel"));
const UploadExcelResult = lazy(() =>
  import("pages/UploadExcel/UploadExcelResult")
);
const PurchaseSummary = lazy(() =>
  import("pages/PurchaseSummary/PurchaseSummary")
);
const TermAndConfirmation = lazy(() =>
  import("pages/TermAndConfirmation/TermAndConfirmation")
);
const SentQRConfirmation = lazy(() =>
  import("pages/PersonDetail/SentQRConfirmation")
);
const BusinessDetail = lazy(() =>
  import("pages/BusinessDetail/BusinessDetail")
);
const ChooseProvideEmployee = lazy(() =>
  import("pages/EmpUploadType/ChooseProvideEmployee")
);
const SelfCompleteEmployee = lazy(() =>
  import("pages/SelfCompleteEmployee/InputEmailAddress")
);
const SelfCompleteEmployeeResult = lazy(() =>
  import("pages/SelfCompleteEmployee/SelfCompleteEmployeeResult")
);
const PaymentType = lazy(() => import("pages/Payment/PaymentType"));
const IdentityVerify = lazy(() =>
  import("pages/IdentityVerify/IdentityVerify")
);
const VideoIdentityVerify = lazy(() =>
  import("pages/IdentityVerify/components/VideoIdentityVerify")
);
const PaymentSuccess = lazy(() =>
  import("pages/Payment/components/PaymentSuccess")
);
const EmployeeSection = lazy(() =>
  import("pages/EmployeeSection/EmployeeSection")
);
const ClientSection = lazy(() => import("pages/ClientSection/ClientSection"));
const DirectorAuthorisation = lazy(() =>
  import("pages/DirectorAuthorisation/DirectorAuthorisation")
);
const Affiliate = lazy(() => import("pages/Affiliate/Affiliate"));
const PrivateRoute = lazy(() =>
  import("common/components/PrivateRoute/PrivateRoute")
);
const PrivateTempRoute = lazy(() =>
  import("common/components/PrivateRoute/PrivateTempRoute")
);
const ForbiddenPage = lazy(() => import("pages/ErrorPage/ForbiddenPage"));
const ErrorPage = lazy(() => import("pages/ErrorPage/Error"));
const Callback = lazy(() => import("pages/Auth/Callback"));
const Logout = lazy(() => import("pages/Auth/Logout"));
const LogoutCallback = lazy(() => import("pages/Auth/LogoutCallback"));
const SilentRenew = lazy(() => import("pages/Auth/SilentRenew"));
const ForgotPassword = lazy(() => import("pages/Auth/ForgotPassword"));

if (process.env.REACT_APP_ENVIRONMENT === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}

function App() {
  const [isMobile, setIsMobile] = useState(false);

  notification.config({
    placement: "bottomRight",
    bottom: 50,
    duration: 3,
  });

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  useEffect(() => {
    console.log("process.env", process.env);
    if (window.innerWidth < 720) setIsMobile(true);
    window.addEventListener("resize", handleResize);
    window.addEventListener('beforeunload', removeAffiliateData);
  }, []);

  const removeAffiliateData = ()=>{
    localStorage.removeItem("affiliate_code");
  }

  return (
    <div className="App">
      <Suspense fallback={<Spinner size="large" />}>
        <Routes>
          <Route
            exact={true}
            path={"/"}
            element={<Welcome isMobile={isMobile} />}
          />
          <Route
            exact={true}
            path={PAGE_LINK.DETAIL_WELCOME.NAME}
            element={<DetailInfo isMobile={isMobile} />}
          />
          <Route
            exact={true}
            path={PAGE_LINK.FORBIDDEN_PAGE.NAME}
            element={<ForbiddenPage />}
          />
          <Route
            exact={true}
            path={PAGE_LINK.ERROR_PAGE.NAME}
            element={<ErrorPage />}
          />
          <Route
            exact={true}
            path={PAGE_LINK.SIGNIN.NAME}
            element={<Callback />}
          />
          <Route
            exact={true}
            path={PAGE_LINK.LOGOUT.NAME}
            element={<Logout />}
          />
          <Route
            exact={true}
            path={PAGE_LINK.LOGOUT_CALLBACK.NAME}
            element={<LogoutCallback />}
          />
          <Route
            exact={true}
            path={PAGE_LINK.SILENT_RENEW.NAME}
            element={<SilentRenew />}
          />
          <Route
            exact={false}
            path={PAGE_LINK.AFFILIATE.NAME}
            element={<Affiliate />}
          />
          <Route path="" element={<Main isMobile={isMobile} />}>
            <Route
              exact={true}
              path={PAGE_LINK.COVER_TYPE.NAME}
              element={<CoverType />}
            />
            <Route
              exact={true}
              path={PAGE_LINK.BUDGET_OFFER.NAME}
              element={<BudgetOffer />}
            />
            <Route
              exact={true}
              path={PAGE_LINK.CONTACT.NAME}
              element={<Contact />}
            />
            <Route
              exact={true}
              path={PAGE_LINK.BUDGET_PER_EMP.NAME}
              element={<BudgetPerEmployee />}
            />
            <Route
              exact={true}
              path={PAGE_LINK.BUSINESS_BRIEF_INFO.NAME}
              element={<BusinessBriefInfo />}
            />
            <Route
              exact={true}
              path={`${PAGE_LINK.PAYMENT_RESULT_FAILED.NAME}/:id`}
              element={<PaymentFailed />}
            />
            <Route
              exact={false}
              path={PAGE_LINK.FORGOT_PASSWORD.NAME}
              element={<ForgotPassword />}
            />
            <Route exact path="" element={<PrivateRoute />}>
              <Route
                exact={true}
                path={`${"client"}/:id`}
                element={<ClientSection />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.BUDGET_OFFER.NAME}/:id`}
                element={<BudgetOffer />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.BUDGET_PER_EMP.NAME}/:id`}
                element={<BudgetPerEmployee />}
              />
              <Route
                exact={true}
                path={PAGE_LINK.BUSINESS_DETAIL.NAME}
                element={<BusinessDetail />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.BUSINESS_DETAIL.NAME}/:id`}
                element={<BusinessDetail />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.EMPLOYEE_PROVIDER.NAME}/:id`}
                element={<ChooseProvideEmployee />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.UPLOAD_FILE.NAME}/:id`}
                element={<UploadExcel />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.UPLOAD_FILE_RESULT.NAME}/:id`}
                element={<UploadExcelResult />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.PURCHASE_SUMMARY.NAME}/:id`}
                element={<PurchaseSummary />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.TERM_CONFIRMATION.NAME}/:id`}
                element={<TermAndConfirmation />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.QR_CONFIRMATION.NAME}/:id`}
                element={<SentQRConfirmation />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.SELF_COMPLETE_EMP.NAME}/:id`}
                element={<SelfCompleteEmployee />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.SELF_COMPLETE_EMP_RESULT.NAME}/:id`}
                element={<SelfCompleteEmployeeResult />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.PAYMENT_TYPE.NAME}/:id`}
                element={<PaymentType />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.PAYMENT_RESULT_SUCCESS.NAME}/:id`}
                element={<PaymentSuccess />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.IDENTITY_VERIFICATION.NAME}/:id`}
                element={<IdentityVerify />}
              />
              <Route
                exact={true}
                path={`${PAGE_LINK.KYC_UPLOAD_SUCCESS.NAME}/:id`}
                element={<SuccessReloadKYC />}
              />
            </Route>
            <Route path={PAGE_LINK.EMPLOYEE_SECTION.NAME} element={<PrivateTempRoute />}>
              <Route exact={true} path={":id"} element={<EmployeeSection />} />
            </Route>
            <Route path={`${PAGE_LINK.DIRECTOR_AUTHORIZATION.NAME}`} element={<PrivateTempRoute />}>
                <Route
                  exact={true}
                  path={`:id`}
                  element={<DirectorAuthorisation />}
                />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
