import { handleActions } from "redux-actions";
import { types } from "../../actions/User";

export default handleActions({
    [types.USER_LOGIN]: {
        throw(state, action) {
            return { error: action.payload };
        }
    },

    ["PENDING_" + types.USER_LOGIN]: () => {
        return {};
    }
}, {});