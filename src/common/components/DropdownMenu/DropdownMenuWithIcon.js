import React from "react";
import { Dropdown, Menu } from "antd";

export default function DropdownMenuWithIcon({
  items,
  triggerType,
  iconComponent,
  ...rest
}) {
  return (
    <Dropdown overlay={<Menu items={items} />} trigger={triggerType} {...rest}>
      {iconComponent}
    </Dropdown>
  );
}
