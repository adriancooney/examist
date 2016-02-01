import { handleActions } from "redux-actions";
import { types } from "../actions/Institution";
import { unionBy } from "lodash/array";

const institutionHandler = {
    next: (state, action) => unionBy([action.payload], state, "id")
};

export default handleActions({
    [types.INSTITUTION]: institutionHandler,
    [types.INSTITUTION_BY_DOMAIN]: institutionHandler,

    [types.USER_LOGOUT]: () => {
        return [];
    }
}, []);