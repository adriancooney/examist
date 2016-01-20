import React, { Component } from "react";
import { Enum } from "../../../Util";

export const PAPER_TYPE = Enum(
    "UNAVAILABLE", // The paper was not available on the server
    "UNINDEXED", // The paper is available but not yet indexed
    "AVAILABLE" // The paper is available and is indexed
);

export default class Paper extends Component {
    render() {
        return (<div className="Paper">Paper View</div>);
    }
}