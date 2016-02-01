import "../../../../style/ui/Layout.scss";
import React from "react";
import Box from "./Box";

export default function FlexBox(props) {
    props = {
        ...props,
        style: {
            ...props.style,
            flexGrow: typeof props.grow !== "undefined" ? props.grow : 1
        }
    };

    return (
        <Box {...props} />
    );
}