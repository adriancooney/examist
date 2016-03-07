import React, { Component, PropTypes } from "react";
import { matchesProperty } from "lodash/util";
import { QuestionList } from "../../ui/question";
import Panel from "../../ui/parser/Panel";

export default class QuestionsPanel extends Component {

    render() {
        return (
            <Panel className="questions" title="Questions">
                {/* <QuestionList questions={this.props.questions} children={::this.findChildren} onAdd={::this.onAdd} /> */}
            </Panel>
        );
    }

    onAdd() {

    }
}