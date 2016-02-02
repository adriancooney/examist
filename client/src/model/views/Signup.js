import { Reducer } from "../../library";

const Signup = new Reducer("signup", {});

/**
 * Set the current domain.
 */
export const setDomain = Signup.createAction("SET_DOMAIN").handle((state, domain) => {
    return { ...state, domain };
});

export default Signup;