import { createAction } from "redux-actions";
import API from "../API";
import { Enum, createNetworkAction } from "../Util";

export const types = Enum(
    "USER_LOGIN",
    "USER_LOGOUT",
    "USER_MODULES"
);

/*
 * Log the user in.
 */
export const login = createAction(types.USER_LOGIN, API.login);

/*
 * Log out the user.
 */
export const logout = createAction(types.USER_LOGOUT);

/*
 * Get the currently logged in User's modules.
 */
export const getModules = createNetworkAction(types.USER_MODULES, api => api.getModules());