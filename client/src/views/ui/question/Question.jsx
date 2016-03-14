import "../../../../style/ui/Question.scss";
import React, { Component, PropTypes } from "react";
import { Button } from "../input";
import { Box, Flex } from "../layout";
import QuestionIndex from "./QuestionIndex";

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        getQuestion: PropTypes.func // Getter function that accepts the question id
    };

    render() {
        const question = this.props.question;
        let content, hasContent = !!question.revision, children = question.children;

        if(children && children.length) {
            children = children.map(this.props.getQuestion)
            children = <QuestionList questions={children} getQuestion={this.props.getQuestion} />;
        }

        if(hasContent) {
            content = (
                <div className="question-content">
                    <p>{question.revision.content}</p>
                </div>
            );
        }

        return (
            <Box className={`Question${ !hasContent ? " no-content" : ""}`}>
                <QuestionIndex index={question.formatted_path[question.formatted_path.length - 1]} />
                <div>
                    { content }
                    { children }
                </div>
            </Box>
        );
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
    questions = questions.map(question => 
        <Question key={question.id} question={question} getQuestion={props.getQuestion} />)

    return (
        <div className="QuestionList">
            { questions }
            { actions.length ? actions : undefined }
        </div>
    );
}

QuestionList.propTypes = {
    questions: PropTypes.array.isRequired,
    getQuestion: PropTypes.func,
    onAdd: PropTypes.func
};