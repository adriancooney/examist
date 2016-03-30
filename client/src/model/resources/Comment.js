import { Resource } from "../../library";
import * as User from "../User";

const Comment = new Resource("comments", "id");

export const getComments = Comment.createStatefulAction("GET_COMMENTS", User.selectAPI, 
    (api, id) => api.getComments(id));

export const create = Comment.createStatefulAction("CREATE_COMMENT", User.selectAPI,
    (api, entity, content, parent) => api.createComment(entity, content, parent));

export const update = Comment.createStatefulAction("UPDATE_COMMENT", User.selectAPI,
    (api, entity, comment, content) => api.updateComment(entity, comment, content));

export const remove = Comment.createStatefulAction("REMOVE_COMMENT", User.selectAPI,
    (api, entity, comment) => api.deleteComment(entity, comment));

Comment.addProducer(getComments, ({ comments }) => comments);
Comment.addProducer(update, ({ comment }) => comment);
Comment.addProducer(remove, ({ comment }) => comment);
Comment.handleAction(create, (comments, { comment }) => {
    if(comment.parent_id) {
        comments = comments.map(c => {
            if(c.id === comment.parent_id) {
                return {
                    ...c,
                    children: [...c.children, comment.id]
                };
            } else return c;
        });
    }

    return [...comments, comment];
});

export function selectById(id) {
    return state => state.resources.comments.filter(comment => comment.entity_id === id);
}

export default Comment;