import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import * as model from "../../model";
import { DEBUG } from "../../Config";

export default class Comments extends Component {
    static selector = (state, { params }, { question }) => {
        return { 
            comments: model.resources.Comment.selectById(question.id)(state)
        };
    };

    static contextTypes = {
        question: PropTypes.object
    };

    static actions = {
        getComments: model.resources.Comment.getComments
    };

    componentWillMount() {
        const { question } = this.context;

        if(!question.comments)
            this.props.getComments(question.id);
    }

    render() {
        const question = this.context.question;

        return (
            <div className="Comments">
                <h1>{`Question ${question.formatted_path.join(". ")}.`}</h1>
            </div>
        );
    }
}

export default connect(Comments.selector, Comments.actions)(Comments);