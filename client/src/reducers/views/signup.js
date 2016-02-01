import { handleActions } from "redux-actions";
import * as actions from "../../actions/";

export default handleActions({
    [actions.views.Signup.types.SIGNUP_SET_DOMAIN]: (state, { payload }) => {
        return {
            domain: payload
        }
    }
}, {});