import React, { createContext, useEffect, useState } from "react";

export const CommonStateDispatchContext = createContext();
export const CommonStateContext = createContext();

export const CommonStateProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenProgress, setIsOpenProgress] = useState(false);
  
  const updateLoadingState = (value) => {
    setIsLoading(value);
  };

  const openProgress = (isOpen) => {
    setIsOpenProgress(isOpen);
  }

  return (
    <CommonStateContext.Provider
      value={{
        isLoading,
        isOpenProgress
      }}
    >
      <CommonStateDispatchContext.Provider
        value={{
            updateLoadingState,
            openProgress
        }}
      >
        {children}
      </CommonStateDispatchContext.Provider>
    </CommonStateContext.Provider>
  );
};