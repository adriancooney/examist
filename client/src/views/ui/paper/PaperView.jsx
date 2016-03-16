import React, { PropTypes } from "react";
import { QuestionList } from "../question";

export default function PaperView(props) {
    const { paper, course} = props;
    const questions = paper.questions;
    const rootQuestions = questions.filter(q => q.path.length === 1);

    return (
        <QuestionList questions={rootQuestions} getQuestion={getQuestion.bind(null, questions)} {...props} />
    );
}

function getQuestion(questions, id) {
    return questions.find(q => q.id === id);
}

PaperView.propTypes = {
    course: PropTypes.object.isRequired,
    paper: PropTypes.object.isRequired
};