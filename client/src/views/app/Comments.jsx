import React, { Component } from "react";
import { connect } from "react-redux";
import * as model from "../../model";
import { DEBUG } from "../../Config";

export default class Comments extends Component {
    static selector = (state, { params }) => {
        const course = model.resources.Course.selectByCode(params.course)(state);
        const question = model.resources.Question.selectByPath(params.path.split(DEBUG ? "-" : ".").map(i => parseInt(i)))(state);
        const paper = model.resources.Paper.selectPaper({ 
            period: params.period,
            year: parseInt(params.year),
            course: course.id 
        })(state);
        const comments = model.resources.Comment.selectById(question.id)

        return { course, question, paper, comments };
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