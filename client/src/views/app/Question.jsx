import "../../../style/app/Question.scss"
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import { Question, Questions } from "../ui/question"
import { Comments } from "../ui/comment"
import { Notes } from "../ui/notes";
import { Loading, Back, Empty } from "../ui";
import * as model from "../../model";
import { DEBUG } from "../../Config";

export default class QuestionView extends Component {
    static selector = (state, { params }, { paper }) => {
        const user = model.User.selectCurrent(state);
        const question = model.resources.Question.selectByPath(
            params.path.split(DEBUG ? "-" : ".").map(i => parseInt(i)), paper.id
        )(state);

        const view = params.view;
        const selection = { 
            question, user,
            isLoading: isPending("GET_COMMENTS")(state) || isPending("GET_SIMILAR_QUESTIONS")(state) || isPending("GET_NOTES")(state)
        };

        if(question && view) {
            if(view === "comments") {
                selection.comments = model.resources.Comment.selectById(question.id)(state);
                selection.comments.forEach(comment => comment.user = model.resources.People.selectById(comment.user_id)(state));
            } else if(view === "similar") {
                selection.similar = model.resources.Question.selectSimilar(question.id)(state);
                selection.papers = selection.similar.map(sim => model.resources.Paper.selectById(sim.paper_id)(state));
            } else if(view === "notes") {
                selection.notes = state.resources.notes.filter(note => note.question_id === question.id);
            }
        }

        return selection;
    };

    static actions = {
        getQuestionByPath: model.resources.Question.getByPath,
        getSimilarQuestions: model.resources.Question.getSimilar,

        getComments: model.resources.Comment.getComments,
        createComment: model.resources.Comment.create,
        editComment: model.resources.Comment.update,
        removeComment: model.resources.Comment.remove,

        createNoteLink: model.resources.Note.createLink,
        getNotes: model.resources.Note.getNotes
    };

    static contextTypes = {
        paper: PropTypes.object,
        course: PropTypes.object
    };

    componentWillMount() {
        const { question } = this.props;
        const { course, paper } = this.context;
        const path = DEBUG ? this.props.params.path.split("-").join(".") : this.props.params.path;
        const view = this.getView();

        if(!question)
            this.props.getQuestionByPath(course.code, paper.year_start, paper.period, path);

        if(question && view)
            this.loadView(view);
    }

    componentWillReceiveProps(nextProps) {
        const { question } = nextProps;
        const view = nextProps.params.view;

        if(!nextProps.isLoading && question && view)
            this.loadView(view, nextProps);
    }

    loadView(view, props) {
        const { question } = props || this.props;
        const { course, paper } = this.context;

        if(view === "comments" && !question.comments) {
            this.props.getComments(question.id);
        } else if(view === "similar" && !question.similar) {
            this.props.getSimilarQuestions(course.code, paper.year_start, paper.period, question.path.join("."));
        } else if(view === "notes" && !question.notes) {
            this.props.getNotes(course.code, paper.year_start, paper.period, question.path.join("."));
        }
    }

    render() {
        const { papers, question, user, isLoading } = this.props;
        const { course, paper } = this.context;

        if(!question)
            return <Loading />;

        let content, view = this.getView();

        if(isLoading) {
            content = <Loading />;
        } else {
            if(view === "comments") {
                content = (
                    <Comments 
                        user={user} 
                        comments={this.props.comments} 
                        onReply={::this.onReply}
                        onEdit={::this.onEdit} 
                        onRemove={::this.onRemove} />
                );
            } else if(view === "similar") {
                const similar = this.props.similar.sort((a, b) => a.similarity < b.similarity ? 1 : 0);

                content = (
                    <Questions 
                        className="similar-questions"
                        papers={papers}
                        course={course}
                        questions={similar}
                        similarView
                        fullPath />
                );
            } else if(view === "notes") {
                content = (
                    <Notes 
                        user={user}
                        notes={this.props.notes}
                        onSubmitLink={::this.onSubmitLink} />
                );
            } else {
                content = (
                    <Empty>
                        <p>{`No ${view}`}</p>
                    </Empty>
                );
            }
        }

        return (
            <div>
                <Back to={this.getPaperLink()}>Back to paper</Back>
                <div className="QuestionView">
                    <Question course={course} paper={paper} question={question} singleView fullPath activeView={view}>
                        { content }
                    </Question>
                </div>
            </div>
        );
    }

    getPaperLink() {
        const { course, paper } = this.context;
        return `/course/${course.code}/paper/${paper.year_start}/${paper.period}/`
    }

    getView() {
        return this.props.params.view || "comments";
    }

    onReply(parent, content) {
        if(!content) content = parent, parent = null;

        if(parent) {
            this.props.createComment(this.props.question.id, content, parent.id);
        } else {
            this.props.createComment(this.props.question.id, content);
        }
    }

    onEdit(comment, content) {
        this.props.editComment(comment.entity_id, comment.id, content);
    }

    onRemove(comment) {
        this.props.removeComment(comment.entity_id, comment.id);
    }

    onSubmitLink(link, description) {
        const { course, paper } = this.context;
        const question = this.props.question;

        this.props.createNoteLink(course.code, paper.year_start, paper.period, question.path.join("."), {
            link, description
        });
    }
}

export default connect(QuestionView.selector, QuestionView.actions)(QuestionView);