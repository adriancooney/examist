import React, { PropTypes } from "react";

export default function Panel(props) {
    const className = "Panel " + (props.className || "")

    return (
        <div className={className}>
            <h3>{ props.title }</h3>

            { props.children }
        </div>
    );
}

Panel.propTypes = {
    title: PropTypes.string.isRequired
};