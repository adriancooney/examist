import { createAction } from "redux-actions";
import API from "../API";

/**
 * Attempt to log the user in.
 */
export const login = createAction("USER_LOGIN", API.login);
export const loading = createAction("USER_LOADING");