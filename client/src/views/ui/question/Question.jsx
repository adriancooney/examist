import "../../../../style/ui/Question.scss";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import CSSTransitionGroup from "react-addons-css-transition-group";
import { Button } from "../input";
import { Box } from "../layout";
import { Icon } from "../";
import QuestionIndex from "./QuestionIndex";

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        course: PropTypes.object.isRequired,
        paper: PropTypes.object.isRequired,
        getQuestion: PropTypes.func // Getter function that accepts the question id
    };

    render() {
        const { question, editable } = this.props;
        const hasContent = !!question.revision;
        let content, marks, detail, children = question.children;

        const questionLink = this.getLink();

        if(children && children.length) {
            children = children.map(this.props.getQuestion);
            children = <QuestionList {...this.props} questions={children} />;
        }

        if(editable) {
            const actions = [
                ["Edit", "edit", ::this.onEditQuestion],
                ["Add", "plus", ::this.onAddSubQuestion],
                ["Delete", "remove", ::this.onDeleteQuestion]
            ];

            detail = actions.map(([name, icon, handler], i) => {
                return (
                    <h6 key={i} onClick={handler}><Icon name={icon} size={1}/> { hasContent ? name : null}</h6>
                );
            });
        } else if(hasContent) {
            const links = {
                "Comments": 0,
                "Solutions": 0,
                "Links": 0
            };

            detail = Object.keys(links).map((name, i) => {
                let value = links[name];

                if(value > 0)
                    name += " (" + value + ")";

                return (<Link to="#" key={i}>{name}</Link>);
            });
        }

        if(editable && !hasContent) {
            detail = <Box vertical className="side-question-detail">{ detail }</Box>
        }

        if(question.marks) {
            marks = <span className="question-marks">{"(" + question.marks + ")"}</span>
        }

        if(hasContent) {
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
                <div>
                    <QuestionIndex link={questionLink} index={question.formatted_path[question.formatted_path.length - 1]} />
                    { editable && !hasContent ? detail : null}
                </div>
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

    onAddSubQuestion() {

    }

    onDeleteQuestion() {

    }

    onEditQuestion() {

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
    questions = questions.map((question, i) => <Question {...props} key={i} question={question} />);

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