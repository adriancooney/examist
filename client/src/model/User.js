import { Reducer } from "../library";
import { Enum } from "../Util";
import API from "../API";

/**
 * User reducer.
 * @type {Reducer}
 */
const User = new Reducer("user", null);

/*
 * Login the user.
 */
export const login = User.createAction("USER_LOGIN", API.login).handle((state, user) => ({
    ...user, 
    api: new API(user.key)
}));

/*
 * Logout the current user.
 */
export const logout = User.createAction("USER_LOGOUT").handle(Reducer.initial);

/*
 * Get the user's modules.
 */
export const getModules = User.createAction("USER_MODULES").handle((state, modules) => ({
    ...state, 
    modules
}));

/*
 * Select the current api.
 */
export const selectAPI = User.select(user => user.api);

export default User;