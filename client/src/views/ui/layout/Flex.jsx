import "../../../../style/ui/Layout.scss";
import React from "react";

export default function Flex(props) {
    props = Object.assign({}, props, {
        className: "Flex " + (props.className || "")
    });

    return (<div {...props} />);
}