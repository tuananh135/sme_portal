import React, { useState } from 'react'
import { InfoCircleFilled, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Modal } from 'antd'
import styled from 'styled-components'
import { ReactComponent as WarningIcon } from 'assets/images/icon-warning.svg'

const Option = styled.div`
  padding: 15px;
  text-align: center;
`

function ResultTabContent({ data, onClickView, onClickEdit, onDeleteEmp }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const items = [
    {
      key: '1',
      label: <div onClick={() => onClickView(selectedItem)}>View profile</div>,
    },
    // {
    //   key: "2",
    //   label: (
    //     <div onClick={() => { }}>Resend QR code</div>
    //   ),
    // },
    {
      key: '2',
      label: <div onClick={() => onClickEdit(selectedItem)}>Edit</div>,
    },
    {
      key: '3',
      label: <div onClick={(val) => onDeleteEmp(selectedItem?.id)}>Delete</div>,
    },
  ]

  return (
    <div>
      {data?.map((item, index) => (
        <div key={index}>
          <div className={`d-flex text-x-small py-2`} style={{ fontWeight: 'bold', backgroundColor: `${item.errorStatus?.length > 0 ? '#fdd7d6' : 'white'}` }}>
            <span className="w-10">{index + 1}.</span>
            <span className="w-80 text-left">{item?.name}</span>
            <span>
              {item.errorStatus?.length > 0 && <WarningIcon style={{ verticalAlign: 'middle', marginRight: 5 }} width={15} height={15} onClick={() => onClickEdit(item)} />}
              <Dropdown overlayClassName="upload-result-dropdown" menu={{ items }} onOpenChange={() => setSelectedItem(item)}>
                <MoreOutlined style={{ verticalAlign: 'middle' }} />
              </Dropdown>
            </span>
          </div>
          {item.dependents &&
            !!item.dependents.length &&
            item.dependents.map((dep, i) => (
              <div className={`d-flex text-x-small`} key={`${index}-${i}`}>
                <span className="w-10"></span>
                <span className="w-80 text-left text-bold">{`${dep?.name} (dependent)`}</span>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

export default ResultTabContent
