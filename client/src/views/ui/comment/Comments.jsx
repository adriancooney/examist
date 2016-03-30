import React, { PropTypes } from "react";
import Reply from "./Reply";
import { CommentList } from "./Comment";
import { Empty } from "../";

export default function Comments(props) {
    const rootComments = props.comments
        .filter(comment => !comment.parent)
        .map(comment => comment.id);

    let content;
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

    return (
        <div className="Comments">
            { content }
            { props.user ? <Reply onReply={props.onReply} /> : null }
        </div>
    )
}

function getComment(comments, id) {
    return comments.find(comment => comment.id === id);
}

Comments.propTypes = {
    comments: PropTypes.array
};