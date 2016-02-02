import { createAction } from "redux-actions";
import API from "../API";
import { 
    Enum, 
    createAuthorizedRequestAction,
    createRequestAction, 
    validate 
} from "../Util";



/*
 * Log the user in.
 */
export const login = createRequestAction(types.USER_LOGIN, 
    (details) => validate(details)
        .then(API.login.bind(API, details))
);

/*
 * Log out the user.
 */
export const logout = createAction(types.USER_LOGOUT);

/*
 * Sign the user up.
 */
export const signup = createRequestAction(types.USER_SIGNUP, 
    (...details) => validate(details)
        .then(API.signup.bind(API, details)) // Create their account.
        .then(API.login.bind(API, details)) // Log them in.
);

/*
 * Get the currently logged in User's modules.
 */
export const getModules = createAuthorizedRequestAction(types.USER_MODULES, api => api.getModules());