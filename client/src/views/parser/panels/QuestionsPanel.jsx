import React, { Component } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import { Empty, Icon } from "../../ui";
import { PaperView } from "../../ui/paper";
import { QuestionActions } from "../../ui/question";
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
        createQuestion: model.resources.Question.create,
        removeQuestion: model.resources.Question.remove
    };

    render() {
        const { paper } = this.props;
        let content;

        if(paper.questions && paper.questions.length) {
            content = ([
                <PaperView key={0}
                    course={this.props.course} 
                    paper={this.props.paper} 
                    editable
                    onAdd={::this.addQuestion} 
                    onRemove={::this.removeQuestion}
                    onEdit={::this.editQuestion} />,

                <QuestionActions key={1}
                    onAdd={::this.addQuestion} />
            ]);
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
        let index;
        const { course, paper } = this.props;

        if(!question) {
            // Add new root question
            const rootQuestions = this.getRootQuestions();
            index = rootQuestions.length + 1
        } else {
            // Add a new question with a parent
            index = question.children.length + 1;
        }

        this.props.createQuestion(course.code, paper.year_start, paper.period, { index }, question);
    }

    removeQuestion(question) {
        const { course, paper } = this.props;

        // Delete a question
        this.props.removeQuestion(course.code, paper.year_start, paper.period, question);
    }

    editQuestion(question) {
        console.log("Editing question", question)
    }

    getRootQuestions() {
        return this.props.paper.questions.filter(q => q.path.length === 1);
    }
}

export default connect(QuestionsPanel.selector, QuestionsPanel.actions)(QuestionsPanel);