import React from "react";
import { Button } from "antd";

export default function BorderedButton({text, icon, onClick, ...rest}) {
    return (
    <Button className={ `TuneBorderedButton ${rest["rootclass"] ?? ""}`} onClick={onClick} {...rest} >
        {icon}{text}
    </Button>)
}