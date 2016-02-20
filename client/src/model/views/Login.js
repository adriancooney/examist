import { Reducer } from "../../library";
import * as User from "../User";

const Login = new Reducer("login", {});

/*
 * Handle when a user forgets to enter a field in the login.
 */
Login.handleError(User.login, (state, error) => ({
    error
}));

/*
 * Reset any errors when they attempt to login again.
 */
Login.handleAction("PENDING_" + User.login.type, Login.initial);

export default Login;