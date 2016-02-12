import { Reducer } from "../../library";
import * as User from "../User";

const Signup = new Reducer("signup", {
    error: null
});

/*
 * Set the current domain.
 */
export const setDomain = Signup.createAction("SIGNUP_SET_DOMAIN").handle((state, domain) => {
    return { ...state, domain };
});

/*
 * Remove the error.
 */
export const clearError = Signup.createAction("SIGNUP_CLEAR_ERROR").handle(state => ({ ...state, error: null }));

/*
 * Handle a signup error.
 */
Signup.handleError(User.create, (state, error) => {
    return { ...state, error };
});

export default Signup;