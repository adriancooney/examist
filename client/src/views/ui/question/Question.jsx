import "../../../../style/ui/Question.scss";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { Button } from "../input";
import { Box, Flex } from "../layout";
import { Empty } from "../";
import QuestionIndex from "./QuestionIndex";
import QuestionActions from "./QuestionActions";

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
        let children = question.children;

        // The link to the current question
        const questionLink = this.getLink();

        if(children.length) {
            // Find the children of the paper via the getter function passsed
            // which returns a question given an ID
            children = children.map(this.props.getQuestion);

            // Create a new question list
            children = <QuestionList {...this.props} questions={children} />;
        }

        let content;
        if(hasContent) {
            let marks;
            if(question.marks) {
                marks = <span className="question-marks">{"(" + question.marks + ")"}</span>
            }

            content = (
                <div className="question-content">
                    <p>{question.revision.content} {marks}</p>
                </div>
            );
        } else if(editable && !question.children.length) {
            content = (
                <Empty>
                    <p>No Content.</p>
                </Empty>
            );
        }

        // Determine the poisition 
        let sideDetail, mainDetail;
        if(editable) {
            let actions = {
                onAdd: ::this.onAddSubQuestion,
                onEdit: ::this.onEditQuestion,
                onDelete: ::this.onDeleteQuestion
            };

            if(!hasContent && question.children.length) {
                // If a question doesn't have any content but has child questions, stick the editing
                // functions underneath the index
                sideDetail = <QuestionActions {...actions} vertical className="side-question-detail" />
            } else {
                // If a question has content or 
                mainDetail = <QuestionActions {...actions} className="question-detail" />;
            }
        } else if(hasContent) {
            let links = [
                ["Solutions", "#"],
                ["Comments", "#"],
                ["Notes", "#"]
            ];

            links = links.map(([text, link], i) => <Link to={link} key={i}>{text}</Link>);
            mainDetail = <Box className="question-detail">{ links }</Box>;
        }

        return (
            <Box className={`Question${ !hasContent ? " no-content" : ""}`}>
                <div>
                    <QuestionIndex link={questionLink} index={question.formatted_path[question.formatted_path.length - 1]} />
                    { sideDetail }
                </div>
                <Flex className="question-main">
                    { content }
                    { mainDetail }
                    { children }
                </Flex>
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