import "../../../../style/ui/Input.scss";
import React, { Component, PropTypes } from "react";

export default class Input extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        clearable: PropTypes.bool,
        onClear: PropTypes.func,
        loading: PropTypes.bool
    };

    render() {
        let label, icon;

        if(label) {
            label = <label htmlFor={this.props.name}>{this.props.label}</label>
        }

        const props = Object.assign({}, this.props, {
            type: this.props.password ? "password" : "text",
            className: this.props.error ? "input-error" : ""
        });

        const input = <input ref="input" {...props} />;
        const clearable = this.props.clearable || !!this.props.onClear;

        if(this.props.loading) {
            icon = (<div className="action loading"></div>);
        } else if(clearable && this.getValue().length) {
            icon = (<div className="action clear" onClick={::this.clear}></div>);
        }

        const hasIcon = clearable || this.props.loading;

        return (
            <div className={`Input ${hasIcon && "icon-view "}${this.props.className || ""}`} role="group">
                { icon }
                { label }
                { input }
            </div>
        );
    }

    getValue() {
        return this.refs.input ? this.refs.input.value : "";
    }

    clear() {
        this.refs.input.value = "";
        this.refs.input.focus();
        if(this.props.onClear) this.props.onClear();
    }
}