import PrimaryButton from 'common/components/Button/PrimaryButton'
import ChatIcon from 'common/components/ChatIcon/ChatIcon'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import { ReactComponent as EmployeeIcon } from 'assets/images/icon-employeeonly.svg'
import { ReactComponent as EmployeeSelectedIcon } from 'assets/images/icon-employeeonly-select.svg'
import { ReactComponent as EmployeeAndFamilyIcon } from 'assets/images/icon-employee-family.svg'
import { ReactComponent as EmployeeAndFamilySelectedIcon } from 'assets/images/icon-employee-family-select.svg'
import { ReactComponent as WarnIcon } from 'assets/images/icon-info.svg'
import StepProgressTrigger from 'common/components/StepPanel/StepProgressTrigger'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`
const PageText = styled.div`
  font-weight: bold;
  justify-content: center;
  color: white;
  margin-top: 30px;
`

const WarnIconStyle = styled.div`
  margin-left: 15px;
  position: relative;

  &:hover:after {
    display: block;
  }
  &:after {
    display: none;
    content: 'Cover for dependents, for example spouse and kids';
    position: absolute;
    width: 180px;
    height: 77px;
    right: 50%;
    font-size: 0.7rem;
    bottom: 50%;
    padding: 15px;
    color: #000;
    z-index: 999;
    word-break: break-word;
    white-space: normal;
    box-shadow: 0px 0px 1px 1px #d9d9d9;
    border-radius: 10px;
    background-color: #fff;
  }
`

function CoverType({ onSubmit }) {
  const [hovered, setHovered] = useState({
    employee: false,
    employeeAndFamily: false,
  })
  const handleSubmit = (type) => {
    localStorage.setItem('coverType.type', type)
    onSubmit(type)
  }
  return (
    <Wrapper>
      <ChatIcon pageName="budgetInput" />
      <PageText className="text-x-large">Who would you like to cover for?</PageText>
      <StepProgressTrigger className="mb-5" />
      <Button
        className="EmployeeButton"
        icon={hovered?.employee ? <EmployeeSelectedIcon style={{ height: '35', width: '50' }} /> : <EmployeeIcon style={{ height: '35', width: '50' }} />}
        onMouseEnter={(prev) => setHovered({ ...prev, employee: true })}
        onMouseLeave={(prev) => setHovered({ ...prev, employee: false })}
        onClick={() => handleSubmit(0)}
      >
        Employees Only
      </Button>
      <Button
        className="EmployeeButton"
        style={{ marginTop: '15px' }}
        icon={
          hovered?.employeeAndFamily ? <EmployeeAndFamilySelectedIcon style={{ height: '35', width: '50' }} /> : <EmployeeAndFamilyIcon style={{ height: '35', width: '50' }} />
        }
        onMouseEnter={(prev) => setHovered({ ...prev, employeeAndFamily: true })}
        onMouseLeave={(prev) => setHovered({ ...prev, employeeAndFamily: false })}
        onClick={() => handleSubmit(1)}
      >
        <p>Employees and family</p>
        <WarnIconStyle>
          <WarnIcon style={{ verticalAlign: 'middle', width: 15, height: 15 }} />
        </WarnIconStyle>
      </Button>
    </Wrapper>
  )
}

export default CoverType
