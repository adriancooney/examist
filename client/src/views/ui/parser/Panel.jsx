import React, { PropTypes } from "react";
import { Flex } from "../layout";

export default function Panel(props) {
    const className = "Panel " + (props.className || "")

    return (
        <Flex className={className}>
            <h3>{ props.title }</h3>

            { props.children }
        </Flex>
    );
}

Panel.propTypes = {
    title: PropTypes.string.isRequired
};