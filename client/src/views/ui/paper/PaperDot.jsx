import "../../../../style/ui/Paper.scss"
import React, { PropTypes } from "react";
import { Link } from "react-router";
import { Enum } from "../../../Util";

export const PAPER_TYPE = Enum(
    "UNAVAILABLE", // The paper was not available on the server
    "UNINDEXED", // The paper is available but not yet indexed
    "AVAILABLE" // The paper is available and is indexed
);

export default function PaperDot(props) {
    let type = PAPER_TYPE.UNAVAILABLE;
    let link = null;

    if(props.paper) {
        let paper = props.paper;

        if(paper.isIndexed) type = PAPER_TYPE.AVAILABLE;
        else type = PAPER_TYPE.UNINDEXED;

        link = <Link to={`/course/${props.course.code}/paper/${paper.year_start}/${paper.period}`}/>
    }

    return (<span className={`PaperDot link-${type.toLowerCase()}${props.current ? " link-active" : ""}`}>{ link }</span>);
}

PaperDot.propTypes = {
    paper: PropTypes.object,
    course: PropTypes.object,
    current: PropTypes.bool
};