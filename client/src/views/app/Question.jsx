import "../../../style/app/Question.scss"
import React, { Component } from "react";
import { connect } from "react-redux";
import { Question } from "../ui/question"
import { Loading } from "../ui";
import * as model from "../../model";
import { DEBUG } from "../../Config";

export default class QuestionView extends Component {
    static selector = (state, { params }) => {
        const course = model.resources.Course.selectByCode(params.course)(state);
        const question = model.resources.Question.selectByPath(params.path.split(DEBUG ? "-" : ".").map(i => parseInt(i)))(state);
        const paper = model.resources.Paper.selectPaper({ 
            period: params.period,
            year: parseInt(params.year),
            course: course.id 
        })(state);

        return { course, question, paper };
    };

    static actions = {
        getQuestionByPath: model.resources.Question.getByPath
    };

    componentWillMount() {
        const { question, course, paper } = this.props;
        const path = DEBUG ? this.props.params.path.split("-").join(".") : this.props.params.path;

        if(!question)
            this.props.getQuestionByPath(course.code, paper.year_start, paper.period, path);
    }

    render() {
        const { question, course, paper } = this.props;

        if(!question)
            return <Loading />;

        return (
            <div className="QuestionView">
                <Question course={course} paper={paper} question={question} fullView />
            </div>
        );
    }
}

export default connect(QuestionView.selector, QuestionView.actions)(QuestionView);