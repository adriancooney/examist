import "../../../../style/ui/Layout.scss";
import React from "react";
import Box from "./Box";

export default function FlexBox(props) {
    props = Object.assign({}, props, {
        className: "Flex " + (props.className || "")
    });

    return (<Box {...props}/>);
}