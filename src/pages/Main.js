import { Layout, notification } from "antd";
import CommonHeader from "common/components/Header/CommonHeader";
import DesktopHeader from "common/components/DesktopHeader/DesktopHeader";
import { PAGE_LINK } from "common/constants/pagelinks";
import {
  EmpGroupDispatchContext,
  EmpGroupStateContext,
} from "contexts/EmpGroupContext";
import {
  NotificationDispatchContext,
  NotificationStateContext,
} from "contexts/NotificationContext";
import React, { useContext, useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { CategoryStateContext } from "contexts/CategoryContext";
import { validate as uuidValidate } from 'uuid';
import { CommonStateContext, CommonStateDispatchContext } from "contexts/CommonStateContext";
import ProgressModal from "common/components/Modal/ProgressModal";

const StyledCommonHeader = styled(CommonHeader)`
  height: 48px;
`;

const StyledDesktopHeader = styled(DesktopHeader)`
  height: 55px;
`;

function Main({ isMobile }) {
  const location = useLocation();
  const { id } = useParams();
  const { notifications } = useContext(NotificationStateContext);
  const { updateNotification } = useContext(NotificationDispatchContext);
  const { updateEmpGroupID } = useContext(EmpGroupDispatchContext);
  const { empGroupData } = React.useContext(EmpGroupStateContext);
  const { isOpenProgress } = React.useContext(CommonStateContext);
  const { openProgress } = React.useContext(CommonStateDispatchContext);

    useEffect(() => {
      if (uuidValidate(id)) {
        updateEmpGroupID(id)
      }
    }, [])

  const getBackground = () => {
    for (let link in PAGE_LINK) {
      const value = PAGE_LINK[link];
      if (location?.pathname?.includes(value.NAME)) {
        return value.BG === "WOMAN"
          ? "tune-background-woman"
          : value.BG === "MAIN-COLOR"
          ? "background-main"
          : "tune-background-man";
      }
    }
  };
  return (
    <Layout className={getBackground()}>
      {isMobile ? <StyledCommonHeader /> : <StyledDesktopHeader />}
      <div className="pt-2 scroll-bar" style={{ overflowY: "auto" }}>
      { id && uuidValidate(id) ? empGroupData ? <Outlet /> : <></> :<Outlet/>}
      </div>
      {notifications.length > 0 &&
        notifications?.map(({ id, message, displayText, types }) => {
          if (!types) {
            notification.info({
              message: message,
              description: displayText,
              onClose: () => {
                updateNotification((noties) =>
                  noties.filter((noti) => noti.id !== id)
                );
              },
            });
          }
          if (types === "error") {
            notification.error({
              message: message,
              description: displayText,
              onClose: () => {
                updateNotification((noties) =>
                  noties.filter((noti) => noti.id !== id)
                );
              },
            });
          }
        })}
      <ProgressModal show={isOpenProgress} setShow={openProgress}/>
    </Layout>
  );
}

export default Main;
