import React, { PropTypes, Children } from "react";
import { Link } from "react-router";
import { omit } from "lodash/object";
import { classify } from "../../../Util";
import Icon from "../Icon";

export default function Button(props) { 
    let children = props.children;
    const className = classify("Button", { 
        textual: props.textual, 
        activated: props.activated,
        danger: props.danger
    }, props.className);

    if(props.icon) {
        children = Children.toArray([
            <Icon name={props.icon} size={props.size} />,
            " ", 
            ...Children.toArray(props.children)
        ]);
    }

    const nextProps = {
        ...omit(props, Object.keys(Button.propTypes)),
        children, className
    }

    if(props.to) {
        return <Link {...nextProps} to={props.to} />;
    } else return <button {...nextProps} />;
}

Button.propTypes = {
    textual: PropTypes.bool,
    activated: PropTypes.bool,
    danger: PropTypes.bool,
    icon: PropTypes.string,
    size: PropTypes.number
};

export function TextButton(props) {    
    return (
        <Button {...props} textual />
    );
}

