import "../../../../style/app/Paper.scss";
import React, { PropTypes } from "react";
import { Link } from "react-router";

export default function PaperFooter(props) {
    const paper = props.paper;

    return (
        <div className="PaperFooter">
            <p>Something wrong with the paper? <Link to={`/module/${paper.module}/paper/${paper.year}/${paper.period}/parse`}>Fix it!</Link></p>
        </div>
    );
}

PaperFooter.propTypes = {
    paper: PropTypes.object.isRequired
};