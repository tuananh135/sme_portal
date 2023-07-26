import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Image, Input } from "antd";
import { S3Images } from "common/constants/s3images";

export default function SearchForTable({ placeholder, onChange, ...rest }) {
  return (
    <Input
      className={`TuneSearchBox ${rest["className"] ?? ""}`}
      size="large"
      placeholder={placeholder}
      onChange={onChange}
      prefix={
        <Image
          preview={false}
          className="w-auto"
          src={S3Images.search}
          {...rest}
        />
      }
    />
  );
}
