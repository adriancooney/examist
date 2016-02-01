import { handleActions } from "redux-actions";
import { types } from "../actions/Paper";
import { unionBy } from "lodash/array";
import { omit } from "lodash/object";

export default handleActions({
    [types.PAPER]: {
        next: (state, action) => unionBy([omit(action.payload.paper, "questions")], state, "id")
    },

    [types.USER_LOGOUT]: () => {
        return [];
    }
}, []);