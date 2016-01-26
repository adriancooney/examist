import { createAction } from "redux-actions";
import API from "../API";
import { Enum, createNetworkAction } from "../Util";

export const types = Enum(
    "USER_LOGIN",
    "USER_MODULES"
);

/*
 * Log the user in.
 */
export const login = createAction(types.USER_LOGIN, API.login);

/*
 * Get the currently logged in User's modules.
 */
export const getModules = createNetworkAction(types.USER_MODULES, api => api.getModules());