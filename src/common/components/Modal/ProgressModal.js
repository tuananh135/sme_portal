import { Button, Col, Image, Input, Modal, Steps } from "antd";
import { useEffect, useState } from "react";
import styled from 'styled-components'
import { useLocation } from "react-router-dom";
import { PROGRESS_STEPS } from "common/constants/constants";
import { ReactComponent as Icon } from "assets/images/icon-tick-only.svg";

//#region Custom theme
const ModalCustom = styled(Modal)`
  .ant-modal, .ant-modal-content {
    text-align: -webkit-center;
    background: #ffffff;
    width: 100%;
    border-radius: 10px;
  }
`;

const Wrapper = styled.div`
  max-width: 220px;
  margin: 0 auto;
`

const StepCustom = styled(Steps)`
  .ant-steps-item-process>.ant-steps-item-container>.ant-steps-item-icon {
    background: #00cfa0 !important;
    border-color: #00cfa0 !important;
  }
  .ant-steps-icon {
    color: transparent !important;
  }
  .ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-tail:after {
    background-color: #00cfa0 !important;
  }
  .ant-steps-item-title {
    font-size: 12px !important;
    font-weight: bold;
  }
  .ant-steps-item-finish .ant-steps-item-icon {
    background-color: #00cfa0;
    border-color: #00cfa0;
}
`

//#endregion

function ProgressModal({ show, setShow }) {
  const [steps, setSteps] = useState([]);
  const [current, setCurrent] = useState(0);
  const location = useLocation()

  useEffect(() => {
    let _current = current;
    const path = location.pathname.split("/")[1];
    Object.keys(PROGRESS_STEPS).forEach((key, i) => {
      if (PROGRESS_STEPS[key].PATH.indexOf("/" + path) >= 0) {
        _current = i;
        setCurrent(i)
        return;
      }
    })
    

    const items = [];
    Object.keys(PROGRESS_STEPS).forEach((key, i) => {
      if (i < _current) {
        items.push({
          title: PROGRESS_STEPS[key].TITLE,
          // icon: <Icon />
        })
      } else {
        items.push({
          title: PROGRESS_STEPS[key].TITLE
        })
      }

    })
    setSteps(items);
  }, [location.pathname])

  return (
    <ModalCustom
      open={show}
      onCancel={() => setShow(false)}
      className="d-flex text-center"
      footer={null}
      destroyOnClose={true}
    >
      <div className="text-bold text-x-large my-5 pb-5">Your Progress so far</div>
      <Wrapper>
        <StepCustom
          direction="vertical"
          current={current}
          size="small"
          items={steps}
        />
      </Wrapper>

    </ModalCustom>
  );
}

export default ProgressModal;
