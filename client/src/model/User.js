import { without } from "lodash/array";
import { Reducer } from "../library";
import { BROWSER } from "../Config";
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
    return user.api;
});

/*
 * Select the current user.
 */
export const selectCurrent = User.select(user => user);

/*
 * Select the users courses.
 */
export const selectCourses = (state) => {
    // Get the users courses ids from the state
    return state.user && state.user.courses ? 
        state.user.courses.map(id => state.resources.courses.find(course => course.id === id)) : null;
}

/*
 * Handle signing up.
 */
export const create = User.createAction("USER_CREATE", API.createUser);

/*
 * Login the user.
 */
export const login = User.createAction("USER_LOGIN", API.login);

/*
 * Restore the user's session.
 */
export const restore = User.createAction("USER_RESTORE");

/*
 * Handle login and signup.
 */
User.handleActions([login, create, restore], (state, user) => {
    // Save the session key to localstorage
    if(BROWSER) window.localStorage.sessionKey = user.key;
    
    return {
        ...user,
        courses: null,
        api: new API(user.key)
    };
});

/*
 * Logout the current user.
 */
export const logout = User.createAction("USER_LOGOUT").handle(() => {
    // Remove the variable from localstorage
    if(BROWSER) window.localStorage.removeItem("sessionKey");

    // Return the initial state
    return User.initial();
});

/*
 * Get the user's courses.
 */
export const getCourses = User.createStatefulAction("USER_COURSES", selectAPI, (api) => api.getCourses()).handle((state, { courses }) => ({
    ...state, 
    courses: courses.map(course => course.id) // Only save the ID's, the Course resource will handle the other data
}));

/*
 * Add a course to a user's profile.
 */
export const addCourse = User.createStatefulAction("USER_ADD_COURSE", 
    selectAPI,
    (api, course) => api.addCourse(course.id).then(() => course)
).handle((state, course) => ({
    ...state,
    courses: state.courses ? [...state.courses, course.id] : [course.id]
}));

/*
 * Add a course to a user's profile.
 */
export const removeCourse = User.createStatefulAction("USER_REMOVE_COURSE", 
    selectAPI,
    (api, course) => api.removeCourse(course.id).then(() => course)
).handle((state, course) => ({
    ...state,
    courses: without(state.courses, course.id)
}));

export default User;