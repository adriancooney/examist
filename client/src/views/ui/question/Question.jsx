import "../../../../style/ui/Question.scss";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { omit } from "lodash/object";
import { Button } from "../input";
import { Box, Flex } from "../layout";
import { Editor } from "../editor";
import { Empty, Markdown } from "../";
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
        const { question } = this.props;
        const { sideDetail, mainDetail } = this.renderDetail();

        return (
            <Box className={`Question${ !this.hasContent() ? " no-content" : ""}`}>
                <div>
                    <QuestionIndex link={this.getLink()} index={question.formatted_path[question.formatted_path.length - 1]} />
                    { sideDetail }
                </div>
                <Flex className="question-main">
                    { this.renderContent() }
                    { mainDetail }
                    { this.renderChildren() }
                </Flex>
            </Box>
        );
    }

    hasContent() {
        return !!this.props.question.revision;
    }

    renderContent() {
        const { question, editable } = this.props;
        const { editing } = this.state;

        if(editing) {
            return (
                <Editor />
            );
        } else if(this.hasContent()) {
            // let marks;
            // if(question.marks) {
                // TODO: Insert marks somewhere!
                // marks = <span className="question-marks">{"(" + question.marks + ")"}</span>
            // }

            return (
                <div className="question-content">
                    <Markdown>{question.revision.content}</Markdown>
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

        if(children.length) {
            // Find the children of the paper via the getter function passsed
            // which returns a question given an ID
            children = children.map(this.props.getQuestion);

            // Create a new question list
            return <QuestionList {...this.props} questions={children} />;
        }
    }

    renderDetail() {
        const { question, editable } = this.props;

        let sideDetail, mainDetail;
        if(editable) {
            // Extract any event handlers in the props and pass them on to the actions
            let actions = Object.keys(this.props)
                .filter(key => key.match(/^on[A-Z]\w+/))
                .reduce((as, key) => {
                    as[key] = this.props[key];
                    return as;
                }, {});

            if(actions.onEdit) {
                // We "extend" the action
                actions.onEdit = ::this.onEdit;
            }

            if(question.children.length) {
                // Simple exception, you can't delete a question if it has children!
                if(actions.onRemove)
                    delete actions.onRemove;

                // If a question doesn't have any content but has child questions, stick the editing
                // functions underneath the index
                sideDetail = <QuestionActions {...actions} question={question} vertical hideText className="side-question-detail" />
            } else {
                // If a question has content or 
                mainDetail = <QuestionActions {...actions} question={question} className="question-detail" />;
            }
        } else if(this.hasContent()) {
            let links = [
                ["Solutions", "#"],
                ["Comments", "#"],
                ["Notes", "#"]
            ];

            links = links.map(([text, link], i) => <Link to={link} key={i}>{text}</Link>);
            mainDetail = <Box className="QuestionActions question-detail">{ links }</Box>;
        }

        return { sideDetail, mainDetail };
    }

    getLink() {
        const { question, course, paper } = this.props;
        return `/course/${course.code}/paper/${paper.year_start}/${paper.period}/q/${question.path.join(".")}`;
    }

    onEdit() {
        this.setState({ editing: true });
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
    onAdd: PropTypes.func
};