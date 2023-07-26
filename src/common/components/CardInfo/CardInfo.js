import React from 'react'
import styled from 'styled-components'

const CardWrapper = styled.div`
    margin: 10px 10px 10px 0;
    padding: 10px;
`

const CardTitle = styled.div`
    font-weight: bolder;
`

const InfoTag = styled.div`
    border-radius: 500px;
    color: red;
    background-color: white;
    margin: 10px 20px 10px 0px;
    width: fit-content;
    text-align: center;
    padding: 0 15px;
    text-transform: uppercase;
    font-weight: bolder;
`

function CardInfo({title, text, tagText, wrapperStyle, className, headStyle}) {

  return (
    <CardWrapper style={wrapperStyle} className={className}>
        {
            tagText && <InfoTag>{tagText}</InfoTag>
        }
        <CardTitle >{title}</CardTitle>
        {text}
    </CardWrapper>
  )
}

export default CardInfo