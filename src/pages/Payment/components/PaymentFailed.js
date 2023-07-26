import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { PAGE_LINK } from "common/constants/pagelinks";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  align-items: center;
  text-align: center;
  justify-content: center;
`;

function PaymentFailed() {
  const location = useLocation();
  const { id } = useParams();
  return (
    <Wrapper className="d-flex d-flex-c">
      <ChatIcon width={50} className="mb-5" />
      <b className="w-70 text-white mb-5 text-large">
        {location?.state?.type === "ByInvoice" ? (
          <span>
            Your invoice is sent to <br /> <u>{location?.state?.email}</u>
          </span>
        ) : (
          <span>
            Oh!<br/>Your payment has failed! 
          </span>
        )}
      </b>
      <div
        className="text-x-small text-white max-width-input w-90"
        style={{ marginBottom: "32px" }}
      >
        {location?.state?.type === "ByInvoice" ? (
          <span>
            {/* Please submit your payment slip to hellp.tpv@tuneprotect.com.
            <br /> We will issue policy after payment is made. */}
          </span>
        ) : (
          <span>
            <p>Your RM1 payment is unsuccessful. Please try again. </p>
            <br />
            If you have any questions, please do not hesitate to contact our customer service hello.tpv@tuneprotect.com
            <br />We will be here to assist you.
          </span>
        )}
      </div>
      <PrimaryButton rootclass="half-width-button" text={"Try Again"} navigateTo={`${PAGE_LINK.PAYMENT_TYPE.NAME}/${id}`} />
    </Wrapper>
  );
}

export default PaymentFailed;
