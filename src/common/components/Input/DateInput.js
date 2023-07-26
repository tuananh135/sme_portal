import { DatePicker } from "antd";
import React from "react";
// import moment from 'moment';

export default function DateInput({disabledDate,placeholder, rootclass, ...rest}) {
    return (
      <DatePicker
        className={`${rootclass} TuneDatePicker`}
        placeholder={placeholder}
        disabledDate={disabledDate}
      />
    );
  }
  