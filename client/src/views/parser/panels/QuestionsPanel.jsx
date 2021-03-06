import React, { Component, Children, PropTypes } from "react";
import { connect } from "react-redux";
import { Empty, Icon } from "../../ui";
import { QuestionActions, Questions } from "../../ui/question";
import { TextButton } from "../../ui/input/Button";
import Panel from "../../ui/parser/Panel";
import * as model from "../../../model";

class QuestionsPanel extends Component {
    static selector = (state, { params }, { course }) => {
        const paper = model.resources.Paper.selectPaper({ 
            period: params.period,
            year: parseInt(params.year),
            course: course.id 
        })(state);

        return {
            paper,
            questions: state.resources.questions.filter(q => q.paper_id === paper.id)    
        }
    };

    static contextTypes = {
        course: PropTypes.object
    };

    static actions = {
        createQuestion: model.resources.Question.create,
        updateQuestion: model.resources.Question.update,
        removeQuestion: model.resources.Question.remove
    };

    render() {
        const { course } = this.context;
        const { questions, paper } = this.props;
        let content;

        if(paper.questions && paper.questions.length) {
            content = Children.toArray([
                <Questions
                    course={course} 
                    paper={paper}
                    questions={questions}
                    editable toplevel
                    onAdd={::this.addQuestion} 
                    onRemove={::this.removeQuestion}
                    onEdit={::this.editQuestion} />,

                <QuestionActions>
                    <TextButton icon="plus" onClick={this.addQuestion.bind(this, null)}>Add Question</TextButton>
                </QuestionActions>
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
        const { course } = this.context;
        const { paper } = this.props;

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
        const { course } = this.context;
        const { paper } = this.props;

        // Delete a question
        this.props.removeQuestion(course.code, paper.year_start, paper.period, question);
    }

    editQuestion(question, changes) {
        const { course } = this.context;
        const { paper } = this.props;

        // Filter out undefined keys
        changes = Object.keys(changes)
            .filter(key => typeof changes[key] !== "undefined")
            .reduce((newChanges, key) => { 
                let nextKey = key;

                if(key === "indexType")
                    nextKey = "index_type";

                newChanges[nextKey] = changes[key]; 
                return newChanges; 
            }, {});

        this.props.updateQuestion(course.code, paper.year_start, paper.period, {
            ...changes,
            path: question.path
        });
    }

    getRootQuestions() {
        return this.props.questions.filter(q => q.path.length === 1);
    }
}

export default connect(QuestionsPanel.selector, QuestionsPanel.actions)(QuestionsPanel);