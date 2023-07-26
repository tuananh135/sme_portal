import { MALAYSIA_POSTAL_CODE } from "common/constants/MalaysiaPostalCode";
import _ from "lodash";
import React, { useCallback, useState } from "react";

function usePostalCode() {
  const [address, setAddress] = useState({
    PostalCode: "",
    City: "",
    State: "",
    Country: "",
  });
  const addressDebounceFn = useCallback(
    _.debounce((postalCode, callbackFn) => {
      const address = MALAYSIA_POSTAL_CODE.find(
        (item) => item.post_code == postalCode
      );
      setAddress({
        PostalCode: postalCode,
        City: address?.city,
        State: address?.state,
        Country: address?.country ?? "Malaysia",
      });
      callbackFn({
        PostalCode: postalCode,
        City: address?.city,
        State: address?.state,
        Country: address?.country ?? "Malaysia",
      });
      console.log(address);
    }, 100),
    []
  );

  return { addressDebounceFn, address };
}

export default usePostalCode;
