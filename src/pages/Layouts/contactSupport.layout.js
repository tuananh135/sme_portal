import { Button, Image, PageHeader } from 'antd'
import styled from 'styled-components'
import { MenuOutlined } from '@ant-design/icons'
import logo from '../../assets/images/Group 74.png'
import backgroundImage from '../../assets/images/banner-content-normal.jpeg'

//#region Custom theme
const BodyTheme = styled.div`
  height: 100vh;
  background-image: url("${backgroundImage}");
  background-position: 65%;
  background-repeat: no-repeat;
  background-size: cover;
`
const PageHeaderCustom = styled(PageHeader)`
  text-align: center;
  background-color: black;
  padding: 0px 24px;
  position: fixed;
  z-index: 1;
  width: 100vw;

  .ant-page-header-back-button {
    color: white;
  }

  .ant-page-header-content {
    width: 0px;
    height: 0px;
    padding-top: 0px;
  }

  .header-btn {
    border-color: transparent !important;
    filter: invert(100%) !important;
  }

  .logo {
    position: fixed;
    top: 10px;
    left: 42%;
    width: 15%;
  }
`
//#endregion

export default function ContactSupportLayout({children}) {
  return (
    <>
      <PageHeaderCustom 
          onBack={() => null}
          extra={[
              <Button className='header-btn' icon={ <MenuOutlined /> }></Button>
          ]}
          ><Image className='logo' preview={false} src={logo}></Image>
      </PageHeaderCustom>
      <BodyTheme>
        <div>{children}</div>
      </BodyTheme>
    </>
  )
}
