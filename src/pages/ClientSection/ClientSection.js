import { PAGE_LINK } from 'common/constants/pagelinks';
import { EmpGroupDispatchContext, EmpGroupStateContext } from 'contexts/EmpGroupContext';
import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { EmployeeGroupService } from 'services/B2CService/EmployeeGroupService';

function ClientSection() {
    const {id} = useParams();
    const navigate = useNavigate();
    const { updateEmpGroupID } = useContext(EmpGroupDispatchContext);
    const { empGroupData, empGroupID } = useContext(EmpGroupStateContext);

    useEffect(() => {
      updateEmpGroupID(id)
    }, [])
    
    useEffect(() => {
      empGroupData &&  navigate(PAGE_LINK.BUDGET_OFFER.NAME+`/${id}`);
    }, [empGroupData])
    
  return (
    <div>{id}</div>
  )
}

export default ClientSection