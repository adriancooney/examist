import React, { PropTypes, Component } from "react";
import { Editor } from "../editor";
import { Button } from "../input";
import { CommentList } from "./Comment";
import { Empty } from "../";

export default class Comments extends Component {
    render() {
        const props = this.props;

        const rootComments = props.comments
            .filter(comment => !comment.parent)
            .map(comment => comment.id);

        let content, editor;
        if(rootComments.length) {
            content = (
                <CommentList
                    user={props.user}
                    onReply={props.onReply}
                    onEdit={props.onEdit}
                    onRemove={props.onRemove}
                    comments={rootComments} 
                    getComment={getComment.bind(null, props.comments)} />
            );
        } else {
            content = (
                <Empty>
                    <p>No Comments</p>
                </Empty>
            );
        }

        if(props.user) {
            editor = (
                <Editor ref="editor">
                    <Button onClick={() => props.onReply(this.refs.editor.getValue())}>Post</Button>
                </Editor>
            )
        }

        return (
            <div className="Comments">
                { content }
                { editor }
            </div>
        )
    }
}

function getComment(comments, id) {
    return comments.find(comment => comment.id === id);
}

Comments.propTypes = {
    comments: PropTypes.array
};