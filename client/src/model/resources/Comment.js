import { Resource } from "../../library";
import * as User from "../User";

const Comment = new Resource("comment", "id");

export const getComments = Comment.createStatefulResourceAction(User.selectAPI, 
    (api, id) => api.getComments(id));

export function selectById(id) {
    return state => state.resources.comments.map(comment => comment.entity === id);
}

export default Comment;