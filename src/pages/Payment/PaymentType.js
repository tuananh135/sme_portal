import { Button, Checkbox, Col, notification, Row, Select } from "antd";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PAGE_LINK } from "common/constants/pagelinks";
import { BankService } from "services/B2CService/BankService";
import { AuthDispatchContext } from "contexts/AuthContext";
import { useParams } from "react-router-dom";
import StepProgressTrigger from "common/components/StepPanel/StepProgressTrigger";

const Wrapper = styled.div`
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  justify-content: space-around;
  padding-top: 2vh;
`;

function PaymentType() {
  const { getUser } = React.useContext(AuthDispatchContext);
  const [paymentType, setPaymentType] = useState(null);
  const [showCreditPayment, setShowCreditPayment] = useState(false);
  const [showBankPayment, setShowBankPayment] = useState(false);
  const [banks, setBanks] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [bankId, setBankId] = useState();
  const { id } = useParams();

  useEffect(() => {
    Promise.all([loadBanksFromCurlec()]);
  }, []);

  const loadBanksFromCurlec = async () => {
    var result = await BankService.GetBankFromCurlec();
    if (result?.data?.data){
      setBanks(result.data.data || []);
    }
  }

  const onSubmitCreditCard = async () => {
    var currentUser = await getUser();
    var values = {};
    values.id = id;
    values.email = currentUser?.profile?.email;
    values.name = currentUser?.profile?.name;
    values.redirectUrl = `${window.location.href.replace(
      `${PAGE_LINK.PAYMENT_TYPE.NAME}`,
      `${PAGE_LINK.PAYMENT_RESULT_SUCCESS.NAME}`
    )}`;
    values.stateType = "CreditCard";
    values.bankId = bankId;
    try {
      var result = await BankService.SubmitForm(values);
      if (result?.status === 200 && result?.data?.code === 200 && result?.data?.data){
        window.location.href = `${result.data?.data?.path}`;
        return;
      }
      notification.error({
        message: result?.data?.message || 'There was an error during the checkout process.',
      });
    } catch (error) {
      notification.error({
        message: error?.response?.data?.error || 'There was an error during the checkout process.',
      });
      return;
    }
  };

  const onSubmitBankTransfer = async () => {
    var currentUser = await getUser();
    var values = {};
    values.id = id;
    values.email = currentUser?.profile?.email;
    values.name = currentUser?.profile?.name;
    values.redirectUrl = `${window.location.href.replace(
      `${PAGE_LINK.PAYMENT_TYPE.NAME}`,
      `${PAGE_LINK.PAYMENT_RESULT_SUCCESS.NAME}`
    )}`;
    values.stateType = "BankTransfer";
    values.bankId = bankId;
    try {
      var result = await BankService.SubmitFPX(values);
      if (result?.status === 200 && result?.data?.code === 200 && result?.data?.data){
        window.location.href = `${result.data?.data?.path}`;
        return;
      }
      
      notification.error({
        message: result?.data?.message || 'There was an error during the checkout process.',
      });
    } catch (error) {
      notification.error({
        message: error?.response?.data?.error || 'There was an error during the checkout process.',
      });
    }
  };

  const handleChange = (e) => {
    setShowCreditPayment(false);
    setShowBankPayment(false);
    setPaymentType(e);
  };

  const onChangeBankId = (e) => {
    setBankId(e);
  };

  const onShowInfo = () => {
    // setShowAdditionalInfo(true);
    notification.error({
      message: 'Sorry, we could not accept third party payment. Please use your company bank or company credit card to make payment.',
      description: 'Not support',
    });
  };

  const generateContent = (paymentType) => {
    if (!paymentType) return;
    if (paymentType === "CreditCard") {
      return (
        <div className="d-flex-c center-items-y w-100 text-left">
          {showCreditPayment ? (
            <>
            <label className="max-width-input w-70 text-x-small text-white">
            Select bank
          </label>
          <Select
            defaultValue={null}
            className="max-width-input w-70 text-left text-small"
            style={{ marginBottom: "32px" }}
            onChange={onChangeBankId}
            popupClassName="payment-select-dropdown"
            placeholder="Select"
            options={banks}
          />
              <Row
                className="max-width-input w-100"
                style={{ textAlign: "justify" }}
              >
                <Col>
                  <Checkbox
                    className="tune-confirm-checkbox"
                    onChange={(e) => setAgreed(e.target.checked)}
                    checked={agreed}
                  >
                    <span
                      className="text-white text-x-small"
                      style={{ textAlign: "justify" }}
                    >
                      I hereby understand and acknowledge that the RM1 charged
                      is a non-refundable administrative fee that authorises
                      Tune Protect Ventures Sdn Bhd to charge the full premium
                      amount automatically at my business's / Company's bank
                      account / credit card at a later date or any outstanding
                      amount that it may incur in the future. And I also
                      understand and agree that the RM1 is non-refundable in the
                      event the application is rejected for whatsoever reasons.
                    </span>
                  </Checkbox>
                </Col>
              </Row>
              <ButtonWrapper className="d-flex-c w-100 center-items-y">
                <Button
                  className={`${
                    agreed ? "TunePrimaryButton" : "TuneTransparentButton"
                  } text-width w-70 text-white mb-5`}
                  style={{ minWidth: "100px" }}
                  onClick={agreed && bankId? onSubmitCreditCard : null}
                >
                  NEXT
                </Button>
              </ButtonWrapper>
            </>
          ) : (
            <>
              <b className="text-white text-large max-width-input mb-3">
                Are you using company credit card?
              </b>
              <ButtonWrapper className="d-flex w-100 max-width-input" style={{ padding: "30px" }}>
                <Button
                  className="TuneWhiteButton w-40"
                  style={{ minWidth: "100px" }}
                  onClick={() => setShowCreditPayment(true)}
                >
                  YES
                </Button>
                <Button
                  className="TuneWhiteButton w-40"
                  style={{ minWidth: "100px" }}
                  onClick={() => onShowInfo()}
                >
                  NO
                </Button>
              </ButtonWrapper>
            </>
          )}
        </div>
      );
    }
    if (paymentType === "BankTransfer") {
      return (
        <div className="d-flex-c center-items-y w-100 text-left">
          {
            showBankPayment ? (
              <>
              <label className="max-width-input w-70 text-x-small text-white">
              Select bank
            </label>
            <Select
              defaultValue={null}
              className="max-width-input w-70 text-left text-small"
              style={{ marginBottom: "32px" }}
              onChange={onChangeBankId}
              popupClassName="payment-select-dropdown"
              placeholder="Select"
              options={banks}
            />
            <Row
              className="max-width-input w-70"
              style={{ textAlign: "justify" }}
            >
              <Col>
                <Checkbox
                  className="tune-confirm-checkbox"
                  onChange={(e) => setAgreed(e.target.checked)}
                  checked={agreed}
                >
                  <span
                    className="text-white text-x-small"
                    style={{ textAlign: "justify" }}
                  >
                    I hereby understand and acknowledge that the RM1 charged is a
                    non-refundable administrative fee that authorises Tune Protect
                    Ventures Sdn Bhd to charge the full premium amount
                    automatically at my business's / Company's bank account /
                    credit card at a later date or any outstanding amount that it
                    may incur in the future. And I also understand and agree that
                    the RM1 is non-refundable in the event the application is
                    rejected for whatsoever reasons.
                  </span>
                </Checkbox>
              </Col>
            </Row>
            <ButtonWrapper className="d-flex-c w-100 center-items-y">
              <Button
                className={`${
                  agreed && bankId ? "TunePrimaryButton" : "TuneTransparentButton"
                } text-width w-70 text-white mb-5`}
                style={{ minWidth: "100px" }}
                onClick={agreed && bankId ? onSubmitBankTransfer : null}
              >
                NEXT
              </Button>
            </ButtonWrapper>
          </>
            ) : (
            <>
              <b className="text-white text-large max-width-input mb-3">
                Are you using company online banking?
              </b>
              <ButtonWrapper className="d-flex w-100 max-width-input" style={{ padding: "30px" }}>
                <Button
                  className="TuneWhiteButton w-40"
                  style={{ minWidth: "100px" }}
                  onClick={() => setShowBankPayment(true)}
                >
                  YES
                </Button>
                <Button
                  className="TuneWhiteButton w-40"
                  style={{ minWidth: "100px" }}
                  onClick={() => onShowInfo()}
                >
                  NO
                </Button>
              </ButtonWrapper>
            </>)
          }
        </div>
      );
    }
  };

  return (
    <Wrapper className="d-flex d-flex-c">
      <ChatIcon pageName="PaymentType" width={50} className="mb-5" />
      <b className="w-70 text-white mb-5 text-large">
      How would you want the premium to be paid?
      </b>
      <StepProgressTrigger/>
      <label className="max-width-input w-70 text-x-small text-white text-left">
        Payment type
      </label>
      <Select
        defaultValue={{
          value: "",
          label: "Please select",
        }}
        className="max-width-input w-70 text-left text-small"
        style={{ marginBottom: "32px" }}
        onChange={handleChange}
        popupClassName="payment-select-dropdown"
        options={[
          {
            value: "CreditCard",
            label: "Credit Card",
          },
          {
            value: "BankTransfer",
            label: "Online Banking",
          },
        ]}
      />
      {generateContent(paymentType)}
    </Wrapper>
  );
}

export default PaymentType;
