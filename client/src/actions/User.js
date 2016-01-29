import { createAction } from "redux-actions";
import API from "../API";
import { Enum, createNetworkAction, validate } from "../Util";

export const types = Enum(
    "USER_LOGIN",
    "USER_LOGOUT",
    "USER_MODULES"
);

/*
 * Log the user in.
 */
export const login = createAction(types.USER_LOGIN, (username, password) => validate(() => {
    if(!username) throw new Error("Please specify a username.");
    if(!password) throw new Error("Please specify a password.");
}).then(API.login.bind(API, username, password)));

/*
 * Log out the user.
 */
export const logout = createAction(types.USER_LOGOUT);

/*
 * Get the currently logged in User's modules.
 */
export const getModules = createNetworkAction(types.USER_MODULES, api => api.getModules());