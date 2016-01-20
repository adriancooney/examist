import React, { Component } from "react";
import { range } from "lodash/util";

import PaperGrid from "./PaperGrid";

export default class Module extends Component {
    render() {
        let papers = range(5).map((v, i) => {
            return { year: 2015 - i }
        });

        return (
            <div className="Module">
                <h1>{ this.props.routeParams.module }</h1>
                <h3>Module View</h3>
                <PaperGrid papers={papers}/>
            </div>
        );
    }
}