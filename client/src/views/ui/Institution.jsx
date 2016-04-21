import "../../../style/ui/index.scss";
import React from "react";
import { Box, Flex } from "./layout";

export default function Institution({ institution = {} }) {
    const shorthand = institution.code || "-";
    const name = institution.name || "-";

    const style = {
        backgroundColor: institution.color_primary
    }

    return (
        <div className="Institution">
            <h1 style={style}>{ shorthand }</h1>
            <div>
                <h2>{ name }</h2>
                <Box>
                    <Flex>
                        <h3>{ institution.user_count || "-" }</h3>
                        <h4>Students</h4>
                    </Flex>
                    <Flex>
                        <h3>{ institution.course_count || "-" }</h3>
                        <h4>Courses</h4>
                    </Flex>
                    <Flex>
                        <h3>{ institution.paper_count || "-" }</h3>
                        <h4>Papers</h4>
                    </Flex>
                </Box>
            </div>
        </div>
    );
}