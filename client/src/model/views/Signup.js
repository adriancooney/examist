import { Reducer } from "../../library";
import * as User from "../User";

const Signup = new Reducer("signup", {
    error: null
});

/**
 * Set the current domain.
 */
export const setDomain = Signup.createAction("SET_DOMAIN").handle((state, domain) => {
    return { ...state, domain };
});

/*
 * Handle a signup error.
 */
Signup.handleAction(User.create, {
    next(state) {
        return { ...state, error: null };
    },

    error(state, error) {
        return { ...state, error };
    }
});

export default Signup;