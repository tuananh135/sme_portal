import { PAGE_LINK } from 'common/constants/pagelinks';
import { navigateToScreen } from 'common/utils/browserUtils';
import React, { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

function Affiliate() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const code = searchParams.get("code")
        if (code) {
           localStorage.setItem("affiliate_code", code);
           navigate('/'); 
        }
    }, [])
    
  return (
    <div></div>
  )
}

export default Affiliate