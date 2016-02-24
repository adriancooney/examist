import "../../../style/ui/index.scss";
import React from "react";
import { Box, Flex } from "./layout";

export default function Institution({ institution = {} }) {
    let shorthand = institution.shorthand || "-";
    let name = institution.name || "-";
    let { students, courses, papers } = institution.stats || {
        students: "-",
        courses: "-",
        papers: "-"
    };

    return (
        <div className="Institution">
            <h1>{ shorthand }</h1>
            <div>
                <h2>{ name }</h2>
                <Box>
                    <Flex>
                        <h3>{ students }</h3>
                        <h4>Students</h4>
                    </Flex>
                    <Flex>
                        <h3>{ courses }</h3>
                        <h4>Courses</h4>
                    </Flex>
                    <Flex>
                        <h3>{ papers }</h3>
                        <h4>Papers</h4>
                    </Flex>
                </Box>
            </div>
        </div>
    );
}