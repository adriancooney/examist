import React from "react";
import { PAPER_TYPE } from "../paper/Paper";

export default function Dot({ type = PAPER_TYPE.UNAVAILABLE }) {
    return (<span className={`Dot ${type}`}></span>);
}