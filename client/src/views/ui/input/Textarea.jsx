import React, { Component } from "react";
import { omit } from "lodash/object";
import { classify } from "../../../Util";

export default class Textarea extends Component {
    render() {
        return (
            <div className={classify("Textarea", this.props.className)}>
                <textarea {...omit(this.props, "className")} ref="textarea" />
            </div>
        );
    }

    getValue() {
        return this.refs.textarea.value;
    }
}