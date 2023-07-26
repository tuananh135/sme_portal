import React from "react";
import { ReactComponent as ErrorIcon } from "assets/images/icon-error-small.svg";

function CustomError({ xlsxError, fieldName }) {
  const currentItem = xlsxError?.find((item) => item?.field === fieldName);
  return (
    <>
      {currentItem ? (
        <div style={{backgroundColor:"red", width:"fit-content"}} className="d-flex text-x-small text-white border-round py-1 px-1">
          <ErrorIcon width={20}> </ErrorIcon>
          <div>{currentItem?.error?.LONG}</div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default CustomError;
