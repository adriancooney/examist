import React, { Component } from "react";
import { range } from "lodash/util";
import { random } from "lodash/number";
import { Box, Flex } from "../../ui/layout";

import PaperGrid from "./PaperGrid";

export default class Module extends Component {
    render() {
        let mod = {
            code: this.props.routeParams.module,
            name: "Maths"
        }

        let papers = range(5).map((v, i) => {
            return { 
                year: 2015 - i, 
                period: ["autumn", "winter", "summer"][random(0, 2)],
                isIndexed: random(0, 1) == 0,
                module: mod.code
            };
        });

        return (
            <Flex className="Module">
                <Box>
                    <Flex><h1>{ mod.code }</h1></Flex>
                    <Flex><h3>{ mod.name }</h3></Flex>
                </Box>
                <PaperGrid papers={papers} module={mod.code}/>
            </Flex>
        );
    }
}