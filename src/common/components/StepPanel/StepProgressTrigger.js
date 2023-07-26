import { Col, Row } from "antd";
import { PROGRESS_STEPS } from "common/constants/constants";
import { CommonStateDispatchContext } from "contexts/CommonStateContext";
import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { useLocation } from "react-router-dom";
import _ from "lodash";

const Wrapper = styled.div`
  display: flex;
  padding: 7px 15px;
  background-color: #000000;
  margin: 0 auto;
  border-radius: 15px;
  width: 90px;
  justify-content: space-between;
`
const Dot = styled.div`
    width: 5px;
    height: 5px;
    border-radius: 50%;
`

function StepProgressTrigger({ className, onClick }) {
    const { openProgress } = React.useContext(CommonStateDispatchContext);
    const [current, setCurrent] = useState(0);
    const [steps, setSteps] = useState([]);
    const location = useLocation()

    useEffect(() => {
        // Init steps
        const items = [];
        Object.keys(PROGRESS_STEPS).forEach(key => {
            items.push({
                title: PROGRESS_STEPS[key].TITLE
            })
        })
        setSteps(items);

        // Init current step
        const path = location.pathname.split("/")[1];
        Object.keys(PROGRESS_STEPS).forEach((key, i) => {
          if (PROGRESS_STEPS[key].PATH.indexOf("/" + path) >= 0) {
            setCurrent(i);
            return;
          }
        })
    }, [])

    return (
        <Row className={`mt-3 ${className}`}>
            <Col span={24} className="text-center">
                <Wrapper onClick={!!onClick ? onClick : () => openProgress(true)}>
                    {steps.map((m, i) => {
                        return (<Dot key={i} style={{ backgroundColor: i <= current ? "#43c400" : "#757581" }}/>)
                    })}
                </Wrapper>
            </Col>
        </Row>
    );
}

export default StepProgressTrigger;
