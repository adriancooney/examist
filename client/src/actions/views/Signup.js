import { createAction } from "redux-actions";
import { Enum } from "../../Util";

export const types = Enum(
    "SIGNUP_SET_DOMAIN"
);

export const setDomain = createAction(types.SIGNUP_SET_DOMAIN);