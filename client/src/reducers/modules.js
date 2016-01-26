import { handleActions } from "redux-actions";
import { types } from "../actions/Module";

export default handleActions({
    [types.MODULE]: {
        next: (state, action) => ({
            ...state,
            [action.payload.module.code]: action.payload.module
        })
    },

    [types.USER_LOGOUT]: () => {
        return {};
    }
}, {});