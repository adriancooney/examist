import "../../../../style/ui/Question.scss";
import React, { PropTypes } from "react";
import { Link } from "react-router";

export default function QuestionIndex(props) {
    return (
        <div className="QuestionIndex">
            <h5><Link to={props.link}>{ props.index + "." }</Link></h5>
        </div>
    );
}

QuestionIndex.propTypes = {
    index: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    link: PropTypes.string.isRequired
};