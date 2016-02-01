import { handleActions } from "redux-actions";
import { types } from "../../actions/User";

export default handleActions({
    [types.USER_LOGIN]: {
        throw(state, { payload }) {
            // Validation error. Display a message.
            let { ref } = payload;

            return { 
                error: `Missing ${ref}.`
            };
        }
    },

    ["PENDING_" + types.USER_LOGIN]: () => {
        return {};
    }
}, {});