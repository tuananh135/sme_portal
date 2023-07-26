import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useState } from "react";

export default function BackPageButton({ ...rest }) {
    return (
      <ArrowLeftOutlined
        onClick={() => window.history.back()}
        style={{fontSize: "16px", color: "white", position: 'absolute', top: '12vh', marginLeft: '10px' }}
      />
    );
}