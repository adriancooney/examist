import "../../../../style/ui/Input.scss";
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

        let input = <input ref="input" {...props} />;

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