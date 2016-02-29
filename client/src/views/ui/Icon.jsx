import React, { PropTypes } from "react";

export default function Icon(props) {
    let className = `fa fa-${props.name}`;

    if(props.size) className += ` fa-${props.size}x`;
    if(props.className) className += " " + props.className;

    return (
        <i {...props} className={className} />
    );
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number
};