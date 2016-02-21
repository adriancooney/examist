import React, { Component } from "react";
import { ModuleList } from "../ui/module";
import { Input } from "../ui/input";
import { Box, Flex, FlexBox } from "../ui/layout";

const MODULE_COLUMN_HEIGHT = 6;

export default class ModulePicker extends Component {
    render() {
        return (
            <Flex className="ModulePicker">
                <Box className="header">
                    <Flex className="your-modules">
                        <h3>Your modules</h3>
                        <ModuleList placeholderCount={MODULE_COLUMN_HEIGHT} />
                    </Flex>
                    <FlexBox vertical className="search-results" grow={2}>
                        <Input placeholder="Find modules.." name="module" />
                        <ModuleList placeholderCount={MODULE_COLUMN_HEIGHT * 2} />
                    </FlexBox>
                </Box>
            </Flex>
        );
    }
}