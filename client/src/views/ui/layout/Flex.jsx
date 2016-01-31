import "../../../../style/ui/Layout.scss";
import React, { PropTypes } from "react";

export default function Flex({ className, style, children, grow = 1 }) {
    let props = {
        children,
        className: "Flex" + (className ? " " + className : ""),
        style: {
            ...style,
            flexGrow: grow
        }
    };

    return (<div {...props} />);
}

Flex.propTypes = {
    grow: PropTypes.number
};