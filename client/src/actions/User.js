import { createAction } from "redux-actions";
import API from "../API";
import { Enum } from "../Util";

export const types = Enum("USER_LOGIN");

/**
 * Attempt to log the user in.
 */
export const login = createAction(types.USER_LOGIN, API.login);