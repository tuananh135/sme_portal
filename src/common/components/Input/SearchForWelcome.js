import React from "react";
import { Input } from "antd";

const { Search } = Input;

export default function SearchForWelcome({ placeholder, onChange, ...rest } ) {
    return (
        <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
        />
    )
}