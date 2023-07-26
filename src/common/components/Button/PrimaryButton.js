import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function PrimaryButton({navigateTo, text, icon, disabled, isLoading, ...rest}) {
    const navigate = useNavigate();
    if (navigateTo) {
        rest.onClick = () => {
            navigate(navigateTo);
        }
    }
    return (
    <Button className={`TunePrimaryButton ${rest["rootclass"] ?? ""}`} disabled={disabled} {...rest} type='primary' loading={isLoading}>
        {icon}{text}
    </Button>)
}