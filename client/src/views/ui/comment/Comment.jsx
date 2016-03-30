import "../../../../style/ui/Comment.scss";
import React, { Component, PropTypes, Children } from "react";
import moment from "moment";
import { Button } from "../input";
import { Markdown, Removed } from "../";
import { Box } from "../layout";
import { Editor } from "../editor";

export default class Comment extends Component {
    static propTypes = {
        user: PropTypes.object // Logged in user
    };

    constructor(props) {
        super(props);

        this.state = {
            replying: false,
            editing: false
        };
    }

    render() {
        const { comment, user } = this.props;
        const { replying, editing } = this.state;
        const timestamp = moment(comment.created_at);
        const isAuthor = user.id === comment.user_id;

        let content, children, form;
        if(comment.children) {
            children = <CommentList {...this.props} comments={comment.children} />;
        }

        if(replying || editing) {
            form = (
                <Editor ref="editor" defaultValue={editing && comment.content}>
                    <Button onClick={editing ? ::this.onEdit : ::this.onReply}>{editing ? "Save" : "Reply"}</Button>
                    <Button onClick={(editing ? this.toggleEdit : this.toggleReply).bind(this, false)} danger>Cancel</Button>
                </Editor>
            );
        }

        if(editing) {
            content = form;
        } else {
            let actions = [];

            if(!comment.deleted) {
                if(isAuthor) {
                    actions = [
                        <Button textual onClick={this.toggleEdit.bind(this, true)}>Edit</Button>,
                        <Button textual danger onClick={::this.onRemove}>Delete</Button>
                    ];
                } else {
                    actions = [
                        <Button textual onClick={this.toggleReply.bind(this, true)}>Reply</Button>,
                        <Button textual>Like</Button>,
                        <Button textual>Report</Button>
                    ];
                }
            }

            const updated = comment.updated_at ? moment(comment.updated_at).fromNow() : false;
            actions.unshift(<span>{
                `Posted ${timestamp.fromNow()} by ${isAuthor ? "you" : comment.user.name}` + 
                `${updated ? " (edited " + updated + ")" : ""}.`
            }</span>);

            content = (
                <div className="comment-main">
                    { comment.deleted ? <Removed /> : <Markdown>{ comment.content }</Markdown> }
                    <Box className="comment-actions">
                        { Children.toArray(actions) }
                    </Box>
                    { form }
                </div>
            );
        }

        return (
            <div className="Comment">
                { content }
                { children }
            </div>
        );
    }

    toggleReply(replying) {
        this.setState({ replying });
    }

    toggleEdit(editing) {
        this.setState({ editing });
    }

    onReply() {
        this.toggleReply(false);
        this.props.onReply(this.props.comment, this.refs.editor.getValue());
    }

    onEdit() {
        this.toggleEdit(false);
        this.props.onEdit(this.props.comment, this.refs.editor.getValue());
    }

    onRemove() {
        if(confirm("Are you sure you want to delete your comment?"))
            this.props.onRemove(this.props.comment);
    }
}

export function CommentList(props) {
    const comments = props.comments.map(props.getComment).sort((a, b) => {
        const isAfter = moment(a.created_at).isAfter(b.created_at);
        return isAfter ? 1 : -1;
    }).map((comment, i) => {
        return <Comment {...props} key={i} comment={comment} />;
    })

    return (
        <div className="CommentList">
            { comments }
        </div>
    );
}

CommentList.propTypes = {
    getComment: PropTypes.func,
    comments: PropTypes.array
};