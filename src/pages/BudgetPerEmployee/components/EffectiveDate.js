import { Button, Col, Row, DatePicker } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import ChatIcon from 'common/components/ChatIcon/ChatIcon';
import StepProgressTrigger from 'common/components/StepPanel/StepProgressTrigger';

const BodyContent = styled.div`
  color: white;
  text-align: center;
  font-size: larger;
  opacity: 0.9;
`;
const DatePickerCustom = styled(DatePicker)`
  padding: 0px 5px !important;
  input {
    font-size: 14px !important;
    padding: 10px !important;
  }
`;

export default function EffectiveDate({ onSubmit }) {
  const [dateString, setDateString] = useState(new Date());

  const disabledDate = (current) => {
    const today = new Date();
    const disabledDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);
    // Disable dates before today and 5 days after today (+6)
    return current && current.valueOf() < disabledDate;
  };
  const onChange = (e) => {
    if (e.toISOString()) {
        setDateString(e.toISOString())
    }
  };
  const handleSubmit = () => {
    localStorage.setItem('effectiveDate.dateString', dateString);
    onSubmit();
  };

  return (
    <BodyContent>
      <ChatIcon pageName="budgetInput" width={50} />
      <Row style={{ justifyContent: 'center' }}>When would you like this cover to</Row>
      <Row style={{ justifyContent: 'center' }}>commence?</Row>
      <StepProgressTrigger/>
      <div style={{ marginTop: '1vh', marginLeft: '5vw', marginRight: '5vw' }} className="d-flex d-flex-c center-items">
        <Col span={24} className="max-width-input w-100 mb-3 px-4 mt-4">
        <DatePickerCustom
        size="large"
        format={"DD/MM/YYYY"}
        className="text-gray w-100 border-round"
        disabledDate={disabledDate}
        onChange={(e) =>onChange(e)}
      />
        </Col>
      </div>
      <Row style={{ display: 'block', marginTop: '35px' }}>
        <Button className='half-width-button' style={{ backgroundColor: '#ec5a54', color: 'white', width: '55vw', height: '40px', borderRadius: '5px', border: '0px' }}
          type="primary" onClick={handleSubmit}
        >Next</Button>
      </Row>
    </BodyContent>
  );
}
