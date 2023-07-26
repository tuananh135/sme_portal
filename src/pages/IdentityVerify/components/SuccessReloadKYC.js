import PrimaryButton from "common/components/Button/PrimaryButton";
import ChatIcon from "common/components/ChatIcon/ChatIcon";
import { PAGE_LINK } from "common/constants/pagelinks";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  align-items: center;
  text-align: center;
  justify-content: center;
`;

function SuccessReloadKYC() {
  const { id } = useParams();
  return (
    <Wrapper className="d-flex d-flex-c">
      <ChatIcon width={50} className="mb-5" />
      <b className="w-70 text-white mb-5 text-large">
        Thank you for reuploading your document.<br/>
        We will review it again.
      </b>
      <PrimaryButton navigateTo={`${PAGE_LINK.EMPLOYEE_PROVIDER.NAME}/${id}`} rootclass="half-width-button" text={"Ok"} />
    </Wrapper>
  );
}

export default SuccessReloadKYC;
