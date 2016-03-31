import "../../../../style/ui/Question.scss";
import React, { Component, PropTypes, Children } from "react";
import { Link } from "react-router";
import { omit } from "lodash/object";
import { capitalize } from "lodash/string";
import { DEBUG } from "../../../Config";
import { Field, Select } from "../input";
import { TextButton } from "../input/Button";
import { Box, Flex } from "../layout";
import { Editor } from "../editor";
import { Empty, Markdown } from "../";
import { classify } from "../../../Util";
import QuestionPath from "./QuestionPath";
import QuestionIndex from "./QuestionIndex";
import QuestionActions from "./QuestionActions";
import Marks from "./Marks";

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        course: PropTypes.object.isRequired,
        paper: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            editing: false
        };
    }

    render() {
        const { editable, singleView } = this.props;
        const { editing } = this.state;
        const actions = this.renderActions();
        const hasContent = this.hasContent();
        const hasChildren = this.hasChildren();

        return (
            <Box className={classify("Question", { "no-content": !hasContent, editing, "single-view": singleView })}>
                <div>
                    { this.renderIndex() }
                    { (editable && hasChildren) ? actions : void 0 }
                </div>
                <Flex className="question-main">
                    { this.renderContent() }
                    { ((editable && !hasChildren) || (!editable && hasContent)) ? actions : void 0 }
                    { this.renderChildren() }
                    { this.props.children }
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
                            <input type="number" ref="marks" min={0} max={150} defaultValue={question.marks || 0}/>
                        </Field>
                    </Box>
                </div>
            );
        } else if(this.hasContent()) {
            return (
                <div className="question-content">
                    <Markdown>{this.getContent()}</Markdown>
                </div>
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
            // Create a new question list
            return <QuestionList {...omit(this.props, "fullView", "fullPath", "className")} questions={children} />;
        }
    }

    renderActions() {
        let actions;
        const { question, editable } = this.props;
        const { editing } = this.state;
        const hasChildren = this.hasChildren();
        const hasContent = this.hasContent();

        if(editing) {
            actions = [
                <TextButton icon="save" onClick={::this.onSaveEditing}>Save</TextButton>,
                <TextButton icon="remove" onClick={::this.onCancelEditing}>Cancel</TextButton>
            ];
        } else if(editable) {
            actions = [
                <TextButton icon="plus" onClick={this.props.onAdd.bind(null, question)}>Add Sub Question</TextButton>,
                <TextButton icon="edit" onClick={::this.onEdit}>Edit</TextButton>
            ];

            if(!hasChildren)
                // You can only remove leaf questions
                actions.push(<TextButton icon="remove" onClick={this.props.onRemove.bind(null, question)}>Delete</TextButton>);
        } else if(this.hasContent()) {
            const link = this.getLink();
            const activeView = this.props.activeView;

            // Default actions
            actions = ["solutions", "comments", "notes"]

            if(question.similar_count && !this.props.similarView)
                actions.push("similar");

            actions = actions.map(view => {
                let text = capitalize(view);

                if(view === "comments" && question.comment_count)
                    text = `Comments (${question.comment_count})`;
                else if(view === "similar")
                    text = `Similar (${question.similar_count})`;

                return <Link className={view === activeView ? "active" : ""} to={`${link}/${view}`}>{text}</Link>
            });
        }

        // Add in the marks
        if(question.marks && !editing && (editable || hasContent) && !(editable && hasChildren))
            actions = actions.concat([<Flex/>, <Marks marks={question.marks} />]);

        return (
            <QuestionActions vertical={editable && hasChildren}>
                { Children.toArray(actions) }
            </QuestionActions>
        );
    }

    renderIndex() {
        const { question, fullPath, singleView } = this.props;
        const link = this.getLink();

        if(singleView || fullPath) {
            return <QuestionPath link={link} question={question} paper={this.getPaper()} full={!singleView} />;
        } else {
            return <QuestionIndex link={link} index={question.formatted_path[question.formatted_path.length - 1]} />
        }
    }

    getLink() {
        const { question, course } = this.props;
        const paper = this.getPaper();

        return `/course/${course.code}/paper/${paper.year_start}/${paper.period}/q/${question.path.join(DEBUG ? "-" : ".")}`;
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

    getPaper() {
        return this.props.paper || this.props.getPaper(this.props.question.paper_id);
    }
}

// Had to move this component to this file because of circular
// dependency. Annoying we can't split them up but cleaner in 
// the long run.
export function QuestionList(props) {
    let { questions, course, getQuestion, paper, getPaper } = props;
        
    questions = questions.map(getQuestion)

    if(!props.sorted)
        questions = questions.sort((a, b) => a.index > b.index);

    if(!props.editable)
        // Filter out questions that don't have content or children (unless we're editing).
        questions = questions.filter(question => !!question.revision || question.children.length)

    questions = questions.map((question, i) => 
            <Question {...omit(props, "questions", "className")}
                question={question}
                paper={paper || getPaper(question.paper_id)}
                key={i} />);

    return (
        <div className={classify("QuestionList", props.className)}>
            { questions }
        </div>
    );
}

QuestionList.propTypes = {
    questions: PropTypes.array.isRequired,
    course: PropTypes.object.isRequired,

    getQuestion: PropTypes.func,
    getPaper: PropTypes.func,

    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onEdit: PropTypes.func
};