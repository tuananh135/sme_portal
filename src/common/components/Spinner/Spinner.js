import { Spin } from 'antd';
import React from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
     position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 5;
    color:red!important;
`;

export default function Spinner({...rest}) {
  return (
    <Wrapper>
        <Spin {...rest}/>
    </Wrapper>
  )
}
