import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const Alignment = styled.div`
  display: flex;
  align-items: left;
  text-align: left;
  justify-content: center;
`;

function PaymentSuccess() {
  const location = useLocation();
  return (
    <Wrapper className="d-flex d-flex-c">
      <ChatIcon pageName="Successful" width={50} className="mb-5" />
      <b className="w-70 text-white mb-5 text-large">
        {location?.state?.type === "ByInvoice" ? (
          <span>
            Your invoice is sent to <br /> <u>{location?.state?.email}</u>
          </span>
        ) : (
          <span>
            Thank You!<br/>Your payment is successful
          </span>
        )}
      </b>
      <div
        className="text-x-small text-white max-width-input w-90"
        style={{ marginBottom: "32px" }}
      >
        {location?.state?.type === "ByInvoice" ? (
          <span>
            Please submit your payment slip to hellp.tpv@tuneprotect.com.
            <br /> We will issue policy after payment is made.
          </span>
        ) : (
          <span>
            <p>Your payment of RM1 is successful and your application is currently under review. Cover will only be effective upon acceptance of application with full premium charged. </p>
            <br />
            What to expect next are as follows,
            <br />
            <Alignment>
            1. Your directors will need to agree with CTOS verification sent via email
            <br />
            2. Full premium will be automatically deducted from your bank account
            <br />
            3. Policy contract will be ready within 3 working days
            </Alignment>
            <br />
            If you have further inquiries, please do not hesitate to contact our customer service for assistance hello.tpv@tuneprotect.com
            <br />
            <br /> Thanks for your patience!
          </span>
        )}
      </div>
      <PrimaryButton rootclass="half-width-button" text={"Done!"}/>
    </Wrapper>
  );
}

export default PaymentSuccess;
