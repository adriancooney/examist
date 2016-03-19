import React, { PropTypes } from "react";
import { QuestionList } from "../question";

export default function PaperView(props) {
    const { paper } = props;
    const questions = paper.questions;
    const rootQuestions = questions.filter(q => q.path.length === 1);

    return (
        <QuestionList {...props} questions={rootQuestions} getQuestion={getQuestion.bind(null, questions)} />
    );
}

function getQuestion(questions, id) {
    return questions.find(q => q.id === id);
}

PaperView.propTypes = {
    course: PropTypes.object.isRequired,
    paper: PropTypes.object.isRequired
};