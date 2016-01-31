import "../../../../style/ui/Layout.scss";
import React, { PropTypes } from "react";

export default function Box({ className, children, style, align = "stretch", vertical = false, justify = "start"}) {
    if(align === "start" || align === "end") align = "flex-" + align;
    if(justify === "start" || justify === "end") justify = "flex-" + justify;

    let props = { 
        children,
        className: "Box" + (className ? " " + className : ""),
        style: {
            ...style,
            alignItems: align,
            flexDirection: vertical ? "column" : "row",
            justifyContent: justify
        }
    }

    return (<div {...props} />);
}

Box.propTypes = {
    align: PropTypes.oneOf(["center", "stretch", "start", "end", "baseline"]),
    justify: PropTypes.oneOf(["start", "end", "center", "space-between", "space-around"]),
    vertical: PropTypes.bool
};