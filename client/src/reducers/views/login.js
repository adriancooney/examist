import { handleActions } from "redux-actions";
import { types } from "../../actions/User";

export default handleActions({
    [types.USER_LOGIN]: {
        throw(state, action) {
            return { error: action.payload };
        }
    },

    [types.PENDING_USER_LOGIN]: () => {
        return {};
    }
}, {});