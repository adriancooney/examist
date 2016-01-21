import "../../../style/UI.scss";
import React from "react";

export default function Box(props) {
    // Bump in the `Box` class into the className property.
    // Object.assign is pretty sweet.
    props = Object.assign({}, props, {
        className: "Box " + 
            (props.vertical ? "box-vertical " : "") +
            (props.center ? "box-center " : "") +
            (props.middle ? "box-middle " : "") +
            (props.className || "")
    });

    return (<div {...props} />);
}