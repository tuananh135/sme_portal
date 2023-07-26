import React, { createContext, useEffect, useState } from "react";

export const NotificationDispatchContext = createContext();
export const NotificationStateContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log(notifications)
  }, [notifications])
  
  const updateNotification = (value) => {
      setNotifications(value);
  };

  return (
    <NotificationStateContext.Provider
      value={{
        notifications,
      }}
    >
      <NotificationDispatchContext.Provider
        value={{
          updateNotification,
        }}
      >
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationStateContext.Provider>
  );
};