import "../../../../style/ui/Question.scss";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { Button } from "../input";
import { Box } from "../layout";
import QuestionIndex from "./QuestionIndex";

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        course: PropTypes.object.isRequired,
        paper: PropTypes.object.isRequired,
        getQuestion: PropTypes.func // Getter function that accepts the question id
    };

    render() {
        const { question } = this.props;
        let content, marks, hasContent = !!question.revision, children = question.children;

        const questionLink = this.getLink();

        if(children && children.length) {
            children = children.map(this.props.getQuestion);
            children = (
                <QuestionList 
                    questions={children} 
                    course={this.props.course}
                    paper={this.props.paper}
                    getQuestion={this.props.getQuestion} />
            );
        }

        let detail = {
            "Comments": 0,
            "Solutions": 0,
            "Links": 0
        };

        if(question.marks) {
            marks = <span className="question-marks">{"(" + question.marks + ")"}</span>
        }

        if(hasContent) {
            detail = Object.keys(detail).map(name => {
                let value = detail[name];

                if(value > 0)
                    name += " (" + detail[name] + ")";

                return (<Link to="#">{name}</Link>);
            });

            content = (
                <div className="question-content">
                    <p>{question.revision.content} {marks}</p>
                    <Box className="question-detail">
                        { detail }
                    </Box>
                </div>
            );
        }

        return (
            <Box className={`Question${ !hasContent ? " no-content" : ""}`}>
                <QuestionIndex link={questionLink} index={question.formatted_path[question.formatted_path.length - 1]} />
                <div>
                    { content }
                    { children }
                </div>
            </Box>
        );
    }

    getLink() {
        const { question, course, paper } = this.props;
        return `/course/${course.code}/paper/${paper.year_start}/${paper.period}/q/${question.path.join(".")}`;
    }
}

// Had to move this component to this file because of circular
// dependency. Annoying we can't split them up but cleaner in 
// the long run.
export function QuestionList(props) {
    let actions = [];

    if(props.onAdd) {
        actions.push(<Button key={0}>Add Question</Button>);
    }

    let questions = props.questions.sort((a, b) => a.index > b.index);
    questions = questions.map((question, i) => 
        <Question 
            key={i} 
            question={question} 
            course={props.course}
            paper={props.paper}
            getQuestion={props.getQuestion} />)

    return (
        <div className="QuestionList">
            { questions }
            { actions.length ? actions : undefined }
        </div>
    );
}

QuestionList.propTypes = {
    questions: PropTypes.array.isRequired,
    course: PropTypes.object.isRequired,
    paper: PropTypes.object.isRequired,
    getQuestion: PropTypes.func,
    onAdd: PropTypes.func
};