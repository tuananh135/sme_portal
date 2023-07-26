import React from "react"
import styled from "styled-components"
import FeatureList from "./FeatureList"

const Background = styled.div`
    background-color: #fff;
    flex: auto;
    position: relative;
    overflow: hidden;
    height: 100vh;

    @media (min-width: 768px) {
        height: 120vh;
    }
`

const BackgroundFlur = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    background: rgb(0 0 0 / 100%);
    z-index: 1
`

const Body = styled.div`
    background-color: #bfbfbf;
    position: absolute;
    bottom: -350px;
    border-radius: 630px;
    width: 630px;
    height: 630px;
    transform: translateX(-315px);
    left: 50%;
    z-index: 1;
    transition: bottom 1.5s;

    @media (min-width: 768px) {
        width: 100%;
        height: 1500px;
        border-radius: 0;
        left: 0;
        transform: translateX(0);
        top: 500px !important
    }
`

const Title = styled.h1`
    color: #f9450f;
    padding-top: 3rem;
    text-align: center;
    margin-bottom: 0;
`

export default function SME_EZY({detailMode, isMobile}) {
    return (
        <Background>
            <Body style={detailMode ? { top: '470px', backgroundColor: '#fff', zIndex: 3 } : {}}>
                <Title>SME <b>EZY</b></Title>
                <div className="text-bold text-center mb-4">
                    Employee Insurance Simplified
                </div>
                { detailMode && <FeatureList isMobile={isMobile}/>}
            </Body>
            <BackgroundFlur/>
            
        </Background>
    )
}