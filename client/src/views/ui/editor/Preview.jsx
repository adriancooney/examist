import React from "react";
import Markdown from "../Markdown";

export default function Preview(props) {
    return (
        <div className="Preview">
            <Markdown>{ props.children }</Markdown>
        </div>
    );
}