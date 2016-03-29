import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import * as model from "../../model";
import { DEBUG } from "../../Config";

export default class Comments extends Component {
    static selector = (state, { params }, { question, course, paper  }) => {
        const comments = model.resources.Comment.selectById(question.id);
        return { course, question, paper, comments };
    };

    static contextTypes = {
        course: PropTypes.object,
        paper: PropTypes.object,
        question: PropTypes.object
    };

    static actions = {
        getComments: model.resources.Comment.getComments
    };

    componentWillMount() {
        const { question } = this.props;

        if(!question.comments)
            this.props.getComments(question.id);
    }

    render() {
        return (
            <div className="Comments">
                <h1>Question comments!</h1>
            </div>
        );
    }
}

export default connect(Comments.selector, Comments.actions)(Comments);