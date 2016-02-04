import { Reducer } from "../../library";
import * as User from "../User";

const Signup = new Reducer("signup", {});

/**
 * Set the current domain.
 */
export const setDomain = Signup.createAction("SET_DOMAIN").handle((state, domain) => {
    return { ...state, domain };
});

/*
 * Handle a signup error.
 */
Signup.handleError(User.signup, (state, error) => {
    return { ...state, error };
});

export default Signup;