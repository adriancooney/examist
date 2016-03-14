import "../../../../style/ui/Question.scss";
import React, { PropTypes } from "react";

export default function QuestionIndex(props) {
    return (
        <div className="QuestionIndex">
            <h5>{ props.index + "." }</h5>
        </div>
    );
}

QuestionIndex.propTypes = {
    index: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};