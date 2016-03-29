import React, { Component } from "react";
import { connect } from "react-redux";

export default class Notes extends Component {
    static selector = () => ({});
    static actions = {};

    render() {
        return (
            <div className="Notes">
                <h1>Notes!</h1>
            </div>
        );
    }
}

export default connect(Notes.selector, Notes.actions)(Notes);