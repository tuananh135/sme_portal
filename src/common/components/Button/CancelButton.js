import React from "react";
import { Button } from "antd";

export default function CancelButton({text, icon, onClick, disabled, ...rest}) {
    return (
    <Button className={ `TuneSecondaryButton ${rest["rootclass"] ?? ""}`} disabled={disabled} onClick={onClick} {...rest} >
        {icon}{text}
    </Button>)
}