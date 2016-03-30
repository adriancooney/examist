import React from "react";
import { Link } from "react-router";

export default function Back(props) {
    if(typeof props.children === "string") {
        props = {
            ...props,
            children: <span dangerouslySetInnerHTML={{__html: `&larr; ${props.children}`}} />
        };
    }

    return (
        <h5 className="Back"><Link {...props} /></h5>
    );
}