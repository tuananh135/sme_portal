import { InfoCircleFilled, MoreOutlined, PlusCircleOutlined, SortAscendingOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as SortUpIcon } from 'assets/images/btn-sort-up.svg'
import { ReactComponent as SortDownIcon } from 'assets/images/btn-sort-down.svg'
import { sortByProps } from 'common/utils/objectUtils'

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const HeaderWrapper = styled.div`
  flex-shrink: 0;
`

const BodyWrapper = styled.div`
  border-top: 1px solid lightgrey;
  overflow-y: auto;
  @media only screen and (max-width: 768px) {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`

function ResultTabContent({ data, onOpenPersonDetailModal, setShowInfoModal, onDeleteEmployee, onShowWarningModal, onResendQR, currentItemHandler }) {
  const [tabData, setTabData] = useState(data)
  const [currentItemId, setCurrentItemId] = currentItemHandler
  const [sortDirection, setSortDirection] = useState('ASC') // 0 for ASC, 1 for DESC
  const items = [
    {
      key: '1',
      label: <div onClick={() => setShowInfoModal(true)}>View profile</div>,
    },
    // {
    //   key: "2",
    //   label: (
    //     <div onClick={() => onResendQR()}>Resend QR code</div>
    //   ),
    // },
    {
      key: '2',
      label: <div onClick={() => onOpenPersonDetailModal(0)}>Edit</div>,
    },
    {
      key: '3',
      label: <div onClick={(val) => onDeleteEmployee(currentItemId)}>Delete</div>,
    },
  ]

  useEffect(() => {
    setTabData(data);
  }, [data])

  const onSortChange = (newState) => {
    setSortDirection(newState)
    const sortedData = sortByProps(data, 'status', sortDirection)
    console.log(sortedData)
    setTabData(sortedData)
  }

  return (
    <ResultWrapper>
      <HeaderWrapper className="text-white w-100 d-flex text-small text-bold my-2">
        <span className="w-10">NO</span>
        <span className="w-50 text-left">EMAIL</span>
        <span className="w-30 text-right">STATUS</span>
        <span className="w-10">
          {sortDirection === 'ASC' ? (
            <SortDownIcon style={{ height: '16px' }} onClick={() => onSortChange('DESC')} />
          ) : (
            <SortUpIcon style={{ height: '16px' }} onClick={() => onSortChange('ASC')} />
          )}
        </span>
      </HeaderWrapper>
      <BodyWrapper>
        {tabData?.map((item, index) => (
          <div
            className={`d-flex text-small my-3 ${item?.status === 0 ? 'text-gray' : item?.status === 1 ? 'text-success' : 'text-error'}`}
            style={{ fontWeight: 'bold' }}
            key={index}
          >
            <span className="w-10">{index + 1}</span>
            <span className="w-50 text-left">{item?.email}</span>
            <span className="w-30 text-right">
              {item?.status === 2 ? (
                <span style={{ textDecoration: 'underline' }} onClick={() => onShowWarningModal(item?.key)}>
                  ERROR!
                </span>
              ) : item?.status === 1 ? (
                'COMPLETED'
              ) : (
                'PENDING'
              )}
            </span>
            <span className="w-10">
              <Dropdown overlayClassName="upload-result-dropdown" menu={{ items }} onOpenChange={() => setCurrentItemId(item?.id)}>
                {item?.status === 'ERROR!' ? <InfoCircleFilled /> : <MoreOutlined />}
              </Dropdown>
            </span>
          </div>
        ))}
      </BodyWrapper>
    </ResultWrapper>
  )
}

export default ResultTabContent
