import React from "react";
import Button from "./Button";

export default function Form(props) {
    let buttonText = props.button || "Submit";

    return (
        <div className="Form">
            { props.children }

            <div className="form-center">
                <Button>{ buttonText }</Button>
            </div>
        </div>
    );
}