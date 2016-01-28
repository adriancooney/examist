import "../../../../style/app/modules/PaperLink.scss"
import React, { PropTypes } from "react";
import { Link } from "react-router";
import { PAPER_TYPE } from "../paper/Paper";

export default function PaperLink(props) {
    let type = PAPER_TYPE.UNAVAILABLE;
    let link = null;

    if(props.paper) {
        let paper = props.paper;

        if(paper.isIndexed) type = PAPER_TYPE.AVAILABLE;
        else type = PAPER_TYPE.UNINDEXED;

        link = <Link to={`/module/${paper.module}/paper/${paper.year}/${paper.period}`}/>
    }

    return (<span className={`PaperLink link-${type.toLowerCase()}`}>{ link }</span>);
}

PaperLink.propTypes = {
    paper: PropTypes.object
};