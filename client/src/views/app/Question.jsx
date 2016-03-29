import "../../../style/app/Question.scss"
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Question } from "../ui/question"
import { Loading } from "../ui";
import * as model from "../../model";
import { DEBUG } from "../../Config";

export default class QuestionView extends Component {
    static selector = (state, { params }, { course }) => {
        return { 
            question: model.resources.Question.selectByPath(
                params.path.split(DEBUG ? "-" : ".").map(i => parseInt(i))
            )(state)
        };
    };

    static actions = {
        getQuestionByPath: model.resources.Question.getByPath
    };

    static contextTypes = {
        paper: PropTypes.object,
        course: PropTypes.object
    };

    static childContextTypes = {
        question: PropTypes.object
    };

    getChildContext() {
        return { question: this.props.question };
    }

    componentWillMount() {
        const { question } = this.props;
        const { course, paper } = this.context;
        const path = DEBUG ? this.props.params.path.split("-").join(".") : this.props.params.path;

        if(!question)
            this.props.getQuestionByPath(course.code, paper.year_start, paper.period, path);
    }

    render() {
        const { question } = this.props;
        const { course, paper } = this.context;

        let view = this.props.location.pathname.match(/\/(comments|solutions|notes)\/?$/);
        view = view ? view[1] : "comments";

        if(!question)
            return <Loading />;

        return (
            <div className="QuestionView">
                <Link to={this.getPaperLink()}>&larr; Back to paper</Link>
                <Question course={course} paper={paper} question={question} fullView activeView={view} />
                { this.props.children }
            </div>
        );
    }

    getPaperLink() {
        const { course, paper } = this.context;
        return `/course/${course.code}/paper/${paper.year_start}/${paper.period}/`
    }
}

export default connect(QuestionView.selector, QuestionView.actions)(QuestionView);