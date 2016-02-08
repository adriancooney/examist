import "../../../../style/ui/Input.scss";
import React, { Component, PropTypes } from "react";

export default class Input extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired
    };

    render() {
        const type = this.props.password ? "password" : "text";

        const props = Object.assign({}, this.props, {
            type,
            className: "Input " + (this.props.error ? "input-error " : "") + (this.props.className || "")
        });

        const input = <input ref="input" {...props} />;

        if(this.props.label) {
            return (
                <div role="group">
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                    { input }
                </div>
            );
        } else {
            return input;
        }
    }

    getValue() {
        return this.refs.input.value;
    }
}