import { Input } from "antd"
import ChatIcon from "common/components/ChatIcon/ChatIcon"
import React from "react"
import styled from "styled-components"
import FeatureList from "./FeatureList"

const Background = styled.div`
    background-color: #00000;
    flex: auto;
    overflow-x:clip;
    /* &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        bottom: 0;
        background: rgb(0 0 0 / 90%);
    } */
`

const Body = styled.div`
    background: white;
    position: relative;
    bottom: 0;
    bottom: 18%;
    border-radius: 600px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    width: 600px;
    height: 600px;
    transform: translateX(-300px);
    left: 50%;
    @media (min-width: 768px) {
        display: none
    }
`

const Title = styled.h1`
    color: #f9450f;
    padding-top: 3rem;
    text-align: center;
`

export default function SME_EZY_Detail() {
    return (
        <Background>
            <Body>
                <Title>SME <b>EZY</b></Title>
                <div className="text-bold text-center">
                    Employee Insurance Simplified
                </div>

            </Body>
            <FeatureList/>
            <div style={{background:"white", position:"relative", bottom:"65%", justifyContent:"center", alignItems:"center"}} className="d-flex-c">
                <div>Ask Me Question!</div>
                <ChatIcon/>
                <Input style={{maxWidth:300}}/>
            </div>
        </Background>
    )
}