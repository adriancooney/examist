import { Reducer } from "../library";
import API from "../API";

/**
 * User reducer.
 * @type {Reducer}
 */
const User = new Reducer("user", null);

/*
 * Select the current api.
 */
export const selectAPI = User.select(user => {
    console.log("USER STATE", user);
    return user.api;
});

/*
 * Select the current user.
 */
export const selectCurrent = User.select(user => user);

/*
 * Select the users modules.
 */
export const selectModules = (state) => {
    // Get the users modules ids from the state
    return state.user && state.user.modules ? 
        state.user.modules.map(id => state.resources.modules.find(module => module.id === id)) : null;
}

/*
 * Login the user.
 */
export const login = User.createAction("USER_LOGIN", API.login).handle((state, user) => ({
    ...user,
    modules: null,
    api: new API(user.key)
}));

/*
 * Logout the current user.
 */
export const logout = User.createAction("USER_LOGOUT").handle(Reducer.initial);

/*
 * Handle signing up.
 */
export const signup = User.createAction("USER_SIGNUP", API.signup);

/*
 * Get the user's modules.
 */
export const getModules = User.createStatefulAction("USER_MODULES", selectAPI, (api) => api.getModules()).handle((state, { modules }) => ({
    ...state, 
    modules: modules.map(module => module.id) // Only save the ID's, the Module resource will handle the other data
}));

export default User;