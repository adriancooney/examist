import React from "react";
import Remarkable from "remarkable";
import { classify } from "../../Util";

export const renderer = new Remarkable();

export default function Markdown(props) {
    const content = React.Children.map(props.children, child => {
        if (typeof child === "string") {
            return <span dangerouslySetInnerHTML={{ __html: renderMarkdown(child) }} />;
        } else return child;
    });

    return (
        <div className={classify("Markdown", props.className)}>
            { content }
        </div>
    );
}

export function renderMarkdown(source) {
    return renderer.render(source);
}