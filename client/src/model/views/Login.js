import { Reducer } from "../../Library";
import * as User from "../User";

const Login = new Reducer("login", {});

/*
 * Handle when a user forgets to enter a field in the login.
 */
Login.handleError(User.login, (state, { ref }) => ({
    error: `Missing ${ref}.`
}));

/*
 * Reset any errors when they attempt to login again.
 */
Login.handleAction("PENDING_" + User.login.type, Reducer.initial);

export default Login;