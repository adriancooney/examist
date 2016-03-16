import React, { Component } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import { Empty, Icon } from "../../ui";
import { PaperView } from "../../ui/paper";
import { TextButton } from "../../ui/input/Button";
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

    static actions = {
        createQuestion: model.resources.Question.create
    };

    render() {
        const { paper } = this.props;
        let content;

        if(paper.questions && paper.questions.length) {
            content = (
                <PaperView course={this.props.course} paper={this.props.paper} editable />
            );
        } else {
            content = (
                <Empty>
                    <Icon name="list" size={5}/>
                    <p>This paper has no questions yet. Get started by <TextButton onClick={this.addQuestion.bind(this, null)}>adding a question</TextButton>.</p>
                </Empty>
            );
        }

        return (
            <Panel className="panel-questions" title="Questions">
                { content }
            </Panel>
        );
    }

    addQuestion(question) {
        const { course, paper } = this.props;

        if(!question) {
            const rootQuestions = this.getRootQuestions();

            // Add new root question
            this.props.createQuestion(course.code, paper.year_start, paper.period, {
                index: rootQuestions.length + 1
            });
        } else {
            // Create a question with the parent
        }
    }

    getRootQuestions() {
        return this.props.paper.questions.filter(q => q.path.length === 1);
    }
}

export default connect(QuestionsPanel.selector, QuestionsPanel.actions)(QuestionsPanel);