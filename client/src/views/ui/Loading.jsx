import "../../../style/ui/index.scss";
import React, { Component } from "react";

export default class Loader extends Component {
    render() {
        let message;

        if(this.props.message) {
            message = <p className="loading-message">{ this.props.message }</message>
        }

        return (
            <div className="Loading">
                { message }
                { this.props.children }
            </div>
        );
    }
}