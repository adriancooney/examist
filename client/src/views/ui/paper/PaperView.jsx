import React, { PropTypes } from "react";
import { QuestionList } from "../question";

export default function PaperView(props) {
    const { paper, questions } = props;
    const rootQuestions = questions.filter(q => q.path.length === 1);

    return (
        <QuestionList {...props} questions={rootQuestions} getQuestion={getQuestion.bind(null, questions)} />
    );
}

function getQuestion(questions, id) {
    const question = questions.find(q => q.id === id);
    if(!question)
        throw new Error("Can't find question.");
    return question;
}

PaperView.propTypes = {
    course: PropTypes.object.isRequired,
    paper: PropTypes.object.isRequired
};