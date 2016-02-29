import React from "react";

export default function Button(props) {
    props = Object.assign({}, props, {
        className: "Button " + (props.className || "")
    });
    
    return (<button {...props} />);
}