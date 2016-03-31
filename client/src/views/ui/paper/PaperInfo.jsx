import React, { PropTypes } from "react";
import { capitalize } from "lodash/string";
import { Flex, Box } from "../layout";
import Icon, { IconLink } from "../Icon";
import { Button } from "../input";
import { Empty } from "../";

export default function PaperInfo(props) {
    const { course, paper } = props;
    const parserLink = `/course/${course.code}/paper/${paper.year_start}/${paper.period}/parse/`;

    return (
        <Flex className="PaperInfo">
            <div className="info">
                <h2>{ `${paper.year_start} ${capitalize(paper.period)}` }</h2>
                <Box>
                    <Flex>
                        <h3>Duration</h3>
                        <Empty><p>No Duration</p></Empty>
                    </Flex>
                    <Flex>
                        <h3>Examiners</h3>
                        <Empty><p>No Examiners</p></Empty>
                    </Flex>
                </Box>
                <h3>Instructions</h3>
                <Empty><p>No Instructions</p></Empty>
                <h3>Requirements</h3>
                <Empty><p>No Requirements</p></Empty>
            </div>
            <div className="actions">
                <Button textual icon="graduation-cap" className="take-exam">Take this exam</Button>
                <Box>
                    <a href={paper.link} target="_blank"><Icon name="external-link" /> PDF</a>
                    <IconLink name="edit" to={parserLink}>Transcribe</IconLink>
                </Box>
            </div>
        </Flex>
    );
}

PaperInfo.propTypes = {
    course: PropTypes.object.isRequired,
    paper: PropTypes.object.isRequired
};