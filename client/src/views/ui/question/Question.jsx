import "../../../../style/app/Question.scss";
import React, { Component, PropTypes } from "react";
import { Button } from "../input";
import { Box, Flex } from "../layout";
import Path from "./Path";

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        children: PropTypes.func // Getter function that accepts the question object
    };

    render() {
        let children;
        const question = this.props.question;

        if(this.props.children || question.children) {
            // If we have a children function passed as a prop, it's
            // used as a getter function which we pass the current
            // question object. We pass this function to all further 
            // question components created.
            let cs = this.props.children ? this.props.children(question) : question.children;

            if(cs.length)
                children = <QuestionList questions={cs} children={this.props.children} />;
        }

        return (
            <div className="Question">
                <Box>
                    <Path path={question.path} />
                    <Flex><h5>{question.content}</h5></Flex>
                </Box>

                { children }
            </div>
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

    return (
        <div className="QuestionList">
            { props.questions.map(question => <Question key={question.id} question={question} children={props.children} />) }
            { actions.length ? actions : undefined }
        </div>
    );
}

QuestionList.propTypes = {
    questions: PropTypes.array.isRequired,
    children: PropTypes.func,
    onAdd: PropTypes.func
};