import "../../../style/ui/index.scss";
import React from "react";
import { Box, Flex } from "./layout";

export default function Institution(props) {
    return (
        <div className="Institution">
            <h1>NUIG</h1>
            <div>
                <h2>National University of Ireland, Galway</h2>
                <Box>
                    <Flex>
                        <h3>312</h3>
                        <h4>Students</h4>
                    </Flex>
                    <Flex>
                        <h3>1230</h3>
                        <h4>Modules</h4>
                    </Flex>
                    <Flex>
                        <h3>15000</h3>
                        <h4>Papers</h4>
                    </Flex>
                </Box>
            </div>
        </div>
    );
}