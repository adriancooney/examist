import React, { Component, PropTypes } from "react";
import Path from "./Path";

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired
    };

    render() {
        return (
            <div className="Question">
                <Path path={this.props.question.path} />
            </div>
        );
    }
}