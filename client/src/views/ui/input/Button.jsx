import React, { Children } from "react";
import { classify } from "../../../Util";
import Icon from "../Icon";

export default function Button(props) { 
    let children = props.children;

    if(props.icon) {
        children = Children.toArray([
            <Icon name={props.icon} size={props.size} />,
            " ", 
            ...Children.toArray(props.children)
        ]);
    }

    return (
        <button {...props}
            children={children}
            className={classify("Button", { "textual": props.textual }, props.className)} />
    );
}

export function TextButton(props) {    
    return (
        <Button {...props} textual />
    );
}

