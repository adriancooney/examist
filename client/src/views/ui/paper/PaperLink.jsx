import "../../../../style/ui/Paper.scss";
import React, { PropTypes } from "react";
import { Link } from "react-router";
import { capitalize } from "lodash/string";
import CourseLink from "../course/CourseLink";
import Box from "../layout/Box";

export default function PaperLink(props) {
    const link = `/course/${props.course.code}/paper/${props.paper.year_start}/${props.paper.period}`;

    return (
        <div className="PaperLink">
            <Box>
                <CourseLink course={props.course} />
                <div className="paper-detail">
                    <h4><Link to={link}>{ props.paper.year_start }</Link></h4>
                    <h5><Link to={link}>{ capitalize(props.paper.period) }</Link></h5>
                </div>
            </Box>
        </div>
    );
}

PaperLink.propTypes = {
    course: PropTypes.object.isRequired,
    paper: PropTypes.object.isRequired
};