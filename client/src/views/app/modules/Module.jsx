import React, { Component } from "react";
import { range } from "lodash/util";
import { random } from "lodash/number";

import PaperGrid from "./PaperGrid";

export default class Module extends Component {
    render() {
        let mod = this.props.routeParams.module;

        let papers = range(5).map((v, i) => {
            return { 
                year: 2015 - i, 
                period: ["autumn", "winter", "summer"][random(0, 2)],
                isIndexed: random(0, 1) == 0,
                module: mod
            };
        });

        return (
            <div className="Module">
                <h1>{ mod }</h1>
                <h3>Module View</h3>
                <PaperGrid papers={papers} module={mod}/>
            </div>
        );
    }
}