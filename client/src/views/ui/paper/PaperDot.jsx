import "../../../../style/ui/Paper.scss"
import React, { PropTypes } from "react";
import { Link } from "react-router";
import { Enum } from "../../../Util";

export const PAPER_TYPE = Enum(
    "UNAVAILABLE", // The paper was not available on the server
    "NOPAPER", // There is not paper for that year/period
    "AVAILABLE" // The paper is available and is indexed
);

export default function PaperDot(props) {
    let type = PAPER_TYPE.NOPAPER;
    let link = null;

    if(props.paper) {
        let paper = props.paper;
        type = paper.link ? PAPER_TYPE.AVAILABLE : PAPER_TYPE.UNAVAILABLE;
        link = <Link to={`/course/${props.course.code}/paper/${paper.year_start}/${paper.period}`}/>
    }

    return (<span className={`PaperDot link-${type.toLowerCase()}${props.current ? " link-active" : ""}`}>{ link }</span>);
}

PaperDot.propTypes = {
    paper: PropTypes.object,
    course: PropTypes.object,
    current: PropTypes.bool
};