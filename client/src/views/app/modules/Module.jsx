import React, { Component } from "react";
import { Enum } from "../../../Util";

export const PAPER_TYPE = Enum(
    "UNAVAILABLE", // The paper was not available on the server
    "UNINDEXED", // The paper is available but not yet indexed
    "INDEXED" // The paper is available and is indexed
);

export function Dot({ type = PAPER_TYPE.UNAVAILABLE }) {
    return (<span className={`Dot ${type}`}></span>);
}

export default class Module extends Component {
    render() {
        return (
            <div className="Module">
                Module View
            </div>
        );
    }
}