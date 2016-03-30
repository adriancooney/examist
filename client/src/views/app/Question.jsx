import "../../../style/app/Question.scss"
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import { Question } from "../ui/question"
import { Comments } from "../ui/comment"
import { Loading, Back } from "../ui";
import * as model from "../../model";
import { DEBUG } from "../../Config";

export default class QuestionView extends Component {
    static selector = (state, { params }) => {
        const user = model.User.selectCurrent(state);
        const question = model.resources.Question.selectByPath(
            params.path.split(DEBUG ? "-" : ".").map(i => parseInt(i))
        )(state);

        const view = params.view;
        const selection = { 
            question, user,
            isLoading: isPending("GET_COMMENTS")(state)
        };

        if(question && view) {
            if(view === "comments") {
                selection.comments = model.resources.Comment.selectById(question.id)(state);
                selection.comments.forEach(comment => comment.user = model.resources.People.selectById(comment.user_id)(state));
            }
        }

        return selection;
    };

    static actions = {
        getQuestionByPath: model.resources.Question.getByPath,

        getComments: model.resources.Comment.getComments,
        createComment: model.resources.Comment.create,
        editComment: model.resources.Comment.update,
        removeComment: model.resources.Comment.remove
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
            this.loadView(view, this.props);
    }

    componentWillReceiveProps(nextProps) {
        const { question } = nextProps;
        const view = this.getView();

        if(!nextProps.isLoading && question && view)
            this.loadView(view, nextProps);
    }

    loadView(view, props) {
        const { question } = props;
        if(view === "comments" && !question.comments) 
            this.props.getComments(question.id);
    }

    render() {
        const { question, user, isLoading } = this.props;
        const { course, paper } = this.context;

        if(!question)
            return <Loading />;

        let content, view = this.getView();

        if(isLoading) {
            content = <Loading />;
        } else {
            if(view === "comments") {
                content = <Comments 
                    user={user} 
                    comments={this.props.comments} 
                    onReply={::this.onReply}
                    onEdit={::this.onEdit} 
                    onRemove={::this.onRemove} />
            }
        }

        return (
            <div>
                <Back to={this.getPaperLink()}>Back to paper</Back>
                <div className="QuestionView">
                    <Question course={course} paper={paper} question={question} fullView activeView={view}>
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
}

export default connect(QuestionView.selector, QuestionView.actions)(QuestionView);