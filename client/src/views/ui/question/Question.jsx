import "../../../../style/ui/Question.scss";
import React, { Component, PropTypes, Children } from "react";
import { Link } from "react-router";
import { omit } from "lodash/object";
import { Field, Select } from "../input";
import { TextButton } from "../input/Button";
import { Box, Flex } from "../layout";
import { Editor } from "../editor";
import { Empty, Markdown } from "../";
import { classify } from "../../../Util";
import QuestionIndex from "./QuestionIndex";
import QuestionActions from "./QuestionActions";

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        course: PropTypes.object.isRequired,
        paper: PropTypes.object.isRequired,
        getQuestion: PropTypes.func // Getter function that accepts the question id
    };

    constructor(props) {
        super(props);

        this.state = {
            editing: false
        };
    }

    render() {
        const { question, editable } = this.props;
        const { editing } = this.state;
        const actions = this.renderActions();
        const hasContent = this.hasContent();
        const hasChildren = this.hasChildren();
        
        return (
            <Box className={classify("Question", { "no-content": !hasContent, editing })}>
                <div>
                    <QuestionIndex link={this.getLink()} index={question.formatted_path[question.formatted_path.length - 1]} />
                    { (editable && hasChildren) ? actions : void 0 }
                </div>
                <Flex className="question-main">
                    { this.renderContent() }
                    { ((editable && !hasChildren) || (!editable && hasContent)) ? actions : void 0 }
                    { this.renderChildren() }
                </Flex>
            </Box>
        );
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.__tempContent) {
            const nextRevision = nextProps.question.revision;
            const currentRevision = this.props.question.revision;

            if(currentRevision && nextRevision && currentRevision.content != nextRevision.content)
                this.setState({ __tempContent: null });
        }
    }

    getContent() {
        if(this.state.__tempContent) return this.state.__tempContent;
        else if(this.props.question.revision) return this.props.question.revision.content;
    }

    hasContent() {
        return !!this.getContent();
    }

    hasChildren() {
        return this.props.question.children.length > 0;
    }

    renderContent() {
        const { question, editable } = this.props;
        const { editing } = this.state;

        if(editing) {
            const options = {
                alpha: "Alpha",
                decimal: "Decimal",
                roman: "Roman"
            };

            return (
                <div>
                    <Editor ref="editor" defaultValue={question.revision && question.revision.content} />
                    <Box>
                        <Field label="Index Type">
                            <Select options={options} ref="indexType" defaultValue={question.index_type}/>
                        </Field>
                        <Field label="Marks">
                            <input type="number" ref="marks" defaultValue={question.marks}/>
                        </Field>
                    </Box>
                </div>
            );
        } else if(this.hasContent()) {
            // let marks;
            // if(question.marks) {
                // TODO: Insert marks somewhere!
                // marks = <span className="question-marks">{"(" + question.marks + ")"}</span>
            // }

            return (
                <Markdown>{this.getContent()}</Markdown>
            );
        } else if(editable && !question.children.length) {
            return (
                <Empty>
                    <p>No Content.</p>
                </Empty>
            );
        }
    }

    renderChildren() {
        let children = this.props.question.children;

        if(children.length > 0) {
            // Find the children of the paper via the getter function passsed
            // which returns a question given an ID
            children = children.map(this.props.getQuestion);

            // Create a new question list
            return <QuestionList {...this.props} questions={children} />;
        }
    }

    renderActions() {
        let actions;
        const { question, editable } = this.props;
        const { editing } = this.state;
        const hasChildren = this.hasChildren();

        if(editing) {
            actions = Children.toArray([
                <TextButton icon="save" onClick={::this.onSaveEditing}>Save</TextButton>,
                <TextButton icon="remove" onClick={::this.onCancelEditing}>Cancel</TextButton>
            ]);
        } else if(editable) {
            actions = [
                <TextButton icon="plus" onClick={this.props.onAdd.bind(null, question)}>Add Sub Question</TextButton>,
                <TextButton icon="edit" onClick={::this.onEdit}>Edit</TextButton>
            ];

            if(!hasChildren)
                // You can only remove leaf questions
                actions.push(<TextButton icon="remove" onClick={this.props.onRemove.bind(null, question)}>Delete</TextButton>);

            actions = Children.toArray(actions);
        } else if(this.hasContent()) {
            actions = Children.toArray([
                <Link to="#">Solutions</Link>,
                <Link to="#">Comments</Link>,
                <Link to="#">Notes</Link>                
            ]);
        }

        return (
            <QuestionActions vertical={editable && hasChildren}>
                { actions }
            </QuestionActions>
        );
    }

    getLink() {
        const { question, course, paper } = this.props;
        return `/course/${course.code}/paper/${paper.year_start}/${paper.period}/q/${question.path.join(".")}`;
    }

    onEdit() {
        this.setState({ editing: true });
    }

    onCancelEditing() {
        this.setState({ editing: false });
    }

    onSaveEditing() {
        const content = this.refs.editor.getValue();
        const marks = this.refs.marks.value;
        const indexType = this.refs.indexType.getValue();

        this.props.onEdit(this.props.question, {
            content, indexType,
            marks: marks ? parseInt(marks) : null
        });

        this.setState({ 
            editing: false,
            __tempContent: content
        });
    }
}

// Had to move this component to this file because of circular
// dependency. Annoying we can't split them up but cleaner in 
// the long run.
export function QuestionList(props) {
    let questions = props.questions;
        
    if(!props.editable)
        // Filter out questions that don't have content or children (unless we're editing).
        questions = questions.filter(question => !!question.revision || question.children.length) 

    questions = questions.sort((a, b) => a.index > b.index)
        .map((question, i) => <Question {...omit(props, "questions")} key={i} question={question} />);

    return (
        <div className="QuestionList">
            { questions }
        </div>
    );
}

QuestionList.propTypes = {
    questions: PropTypes.array.isRequired,
    course: PropTypes.object.isRequired,
    paper: PropTypes.object.isRequired,
    getQuestion: PropTypes.func,

    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onEdit: PropTypes.func
};