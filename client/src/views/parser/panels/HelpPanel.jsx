import React, { Component } from "react";
import Panel from "../../ui/parser/Panel";
import { Markdown } from "../../ui";

export default class HelpPanel extends Component {
    render() {
        return (
            <Panel className="help" title="Help">
                <Markdown>{`
# FAQ
### A question has an **OR** clause, what do I do?
In the case where a question says do _1. a_ **OR** _1. b_, you write the entire
question (including both clauses) as question 1. For example:

> 1. a. When did Christopher travel to America?
>
> OR
>
> 1. b. How did Christopher travel to America?

Translates to:

> 1. When did Christopher travel to America?
>
> OR
>
> How did Christopher travel to America?
                `}</Markdown>
            </Panel>
        );
    }
}