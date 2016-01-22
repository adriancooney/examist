import "../../../../style/UI.scss";
import React from "react";

export default function Input(props) {
    let type = props.password ? "password" : "text";

    props = Object.assign({}, props, {
        className: "Input " + (props.className || ""),
        type
    });

    return (
        <input {...props} />
    );
}