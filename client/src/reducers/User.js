import { Reducer } from "../library";
import API from "../API";

/**
 * User action types.
 * @type {Enum}
 */
export const actions = Enum(
    "USER_LOGIN",
    "USER_LOGOUT",
    "USER_SIGNUP",
    "USER_MODULES"
);

/**
 * User reducer.
 * @type {Reducer}
 */
export default const User = new Reducer("user", null);

/*
 * Handle user logging in. Create new API instance.
 */
User.handleAction(actions.USER_LOGIN, (state, user) => ({
    ...user, 
    api: new API(user.key)
});

/*
 * Handle user logging out. Return state to initial state.
 */
User.handleAction(actions.USER_LOGOUT, Reducer.initial);

/*
 * Handle receiving user's modules.
 */
User.handleAction(actions.USER_MODULES, (state, module) => ({
    ...state, 
    modules
});