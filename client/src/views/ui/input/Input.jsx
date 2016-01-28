import "../../../../style/UI.scss";
import React, { Component, PropTypes } from "react";

export default class Input extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired
    };

    render() {
        let type = this.props.password ? "password" : "text";

        let props = Object.assign({}, this.props, {
            className: "Input " + (this.props.className || ""),
            type
        });

        return (
            <input ref="input" {...props} />
        );
    }

    getValue() {
        return this.refs.input.value;
    }
}