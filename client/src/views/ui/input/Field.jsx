import React from "react";

export default function Field(props) {
    let label;
    if(props.label) {
        label = <label>{props.label}</label>;
    }

    return (
        <fieldset className="Field">
            { label }
            { props.children }
        </fieldset>
    );
}