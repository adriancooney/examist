import React, { PropTypes } from "react";
import { Link } from "react-router";
import { Flex } from "../layout";

export default function PaperInfo(props) {
    const { course, paper } = props;
    const parserLink = `/course/${course.code}/paper/${paper.year_start}/${paper.period}/parse/`;

    return (
        <Flex className="PaperInfo">
            <p><Link to={parserLink}>Open paper in transcriber.</Link></p>
        </Flex>
    );
}

PaperInfo.propTypes = {
    course: PropTypes.object.isRequired,
    paper: PropTypes.object.isRequired
};