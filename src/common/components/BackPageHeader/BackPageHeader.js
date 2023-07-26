import React from "react";
import { LeftOutlined } from "@ant-design/icons";
import { PageHeader } from "antd";

function BackPageHeader({ title, subTitle, onBack, ...rest }) {
  return (
    <PageHeader
      onBack={onBack}
      title={title}
      subTitle={subTitle}
      backIcon={<LeftOutlined className="text-primary"/>}
      {...rest}
    />
  );
}

export default BackPageHeader;
