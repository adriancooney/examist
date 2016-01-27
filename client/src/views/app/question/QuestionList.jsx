import React, { PropTypes } from "react";
import Question from "./Question";

export default function QuestionList(props) {
    console.log(props.questions);
    return (
        <div className="QuestionList">
            { props.questions.map(question => <Question key={question.id} question={question} />) }
        </div>
    );
}

QuestionList.propTypes = {
    questions: PropTypes.array.isRequired
};