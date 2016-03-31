import React from "react";
import { Link } from "react-router";
import { capitalize } from "lodash/string";
import QuestionIndex from "./QuestionIndex";

export default function QuestionPath(props) {
    const { full, question, paper, link } = props;

    let paperDetail;
    if(full) {
        paperDetail = (
            <div className="paper-detail">
                <h3><Link to={link}>{ paper.year_start }</Link></h3>
                <h4><Link to={link}>{ capitalize(paper.period) }</Link></h4>
            </div>
        );
    }

    return (
        <div className="QuestionPath">
            <QuestionIndex full question={question} link={link} />
            { paperDetail }
        </div>
    );
}