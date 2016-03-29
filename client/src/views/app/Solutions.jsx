import React, { Component } from "react";
import { connect } from "react-redux";

export default class Solutions extends Component {
    static selector = undefined;
    static actions = {};

    render() {
        return (
            <div className="Solutions">
                <h1>Solutions</h1>
            </div>
        );
    }
}

export default connect(Solutions.selector, Solutions.actions)(Solutions);