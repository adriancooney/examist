import { handleActions } from "redux-actions";
import { types } from "../actions/Module";

export default handleActions({
    [types.MODULE]: (state, action) => ({
        ...state,
        [action.payload.module.code]: action.payload.module
    })
}, {});