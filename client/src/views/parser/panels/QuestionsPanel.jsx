import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import { matchesProperty } from "lodash/util";
import { QuestionList } from "../../ui/question";
import { PaperView } from "../../ui/paper";
import Panel from "../../ui/parser/Panel";
import * as model from "../../../model";

class QuestionsPanel extends Component {
    static selector = (state, { params }) => {
        const course = model.resources.Course.selectByCode(params.course)(state);

        return {
            course,
            paper: model.resources.Paper.selectPaperWithQuestions({ 
                period: params.period,
                year: parseInt(params.year),
                course: course.id 
            })(state),
            isLoadingPaper: isPending(model.resources.Paper.getPaper.type)(state)
        };
    };

    render() {
        return (
            <Panel className="panel-questions" title="Questions">
                <PaperView course={this.props.course} paper={this.props.paper} editable />
            </Panel>
        );
    }
 
    onAdd() {

    }
}

export default connect(QuestionsPanel.selector)(QuestionsPanel);