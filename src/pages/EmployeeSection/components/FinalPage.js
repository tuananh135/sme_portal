import ChatIcon from 'common/components/ChatIcon/ChatIcon';
import React from 'react'
import styled from 'styled-components';

const PageText = styled.div`
  font-weight: bold;
  justify-content: center;
  color: white;
  margin-top: 30px;
  margin-bottom: 50px;
`;
const Wrapper = styled.div`
  text-align: center;
`;
function FinalPage() {
  return (
    <Wrapper>
      <ChatIcon />
      <PageText className="text-x-large text-center">
        Thank You <br />
        For choosing us
      </PageText>
    </Wrapper>
  )
}

export default FinalPage