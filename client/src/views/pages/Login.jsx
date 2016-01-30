import "../../../style/pages/Login.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as actions from "../../actions";
import { FlexBox } from "../ui/layout";
import { Form, Input } from "../ui/input";
import { ErrorMessage } from "../ui/error";
import { Loading } from "../ui";
import * as selectors from "../../selectors";
import { select } from "../../Store";

/**
 * The path to login on successful redirect.
 * @type {String}
 */
const LOGIN_REDIRECT = "/";

/*
 * Login Flow
 *
 * The login flow is slightly complicated because that's how Redux rolls. Things
 * are hard to grasp at first and are still hard to grasp when you come back to 
 * it five days later but it works and works beautifully.
 *
 * This components handles the following cases:
 * 1. User reaches `/login` not logged in.
 * 2. User reaches `/login` logged in.
 * 3. User logs in using the form with correct credentials.
 * 4. User logs in using the form with incorrect credentials.
 *
 * If case 1. happens, the state's user property is null and we
 * just render the login form. To handle case 2., we pass the 
 * static `Login.onEnter` method to the route for `/login` which
 * will check the state for the user property. If it exists, it
 * redirects to the user back to LOGIN_REDIRECT. 
 * 
 * Case 3 is the tricky one. We emit two actions, USER_LOADING and
 * USER_LOGIN. The user loading modifies the state to add a flag
 * to denote that a network request is being performed to login the
 * user. We show the loader when that state is active. The USER_LOGIN
 * action is then fired once the network request is completed. If that
 * request is successful, we set the user property on the state. The
 * component has previously binded that piece of state to it's props so
 * when we set the user on the state, our `componentWillReceiveProps` method
 * is called with the new user and we can then redirect the browser to 
 * LOGIN_REDIRECT.
 * 
 */
class Login extends Component {
    static actions = {
        login: actions.User.login,
        loading: actions.User.loading,
        push: actions.Routing.push
    };

    static selector = (state) => ({
        user: selectors.User.current(state),
        isLoading: isPending(actions.User.types.USER_LOGIN)(state),
        state: selectors.View.login(state)
    });

    /*
     * This method is called by the `/login` route when we attempt
     * to access the route. If we're logged in, we just redirect them
     * back to the LOGIN_REDIRECT.
     */
    static onEnter = (nextState, replace) => {
        const user = select(selectors.User.current);

        if(user)
            replace(LOGIN_REDIRECT);
    };

    componentWillReceiveProps(props) {
        // Once we log in, this component will recieve a user property from the current
        // state. When that happens, it means we have successfully logged in and we
        // can redirect to the location passed in the location.state or LOGIN_REDIRECT.
        if(props.user)
            this.props.push(props.location.state ? props.location.state.location : LOGIN_REDIRECT);
    }

    render() {
        let error = this.props.state.error ? <ErrorMessage error={this.props.state.error} /> : null;

        let form = this.props.isLoading ? <Loading /> : (
            <Form button="Login" onSubmit={::this.onLogin}>
                <Input name="username" placeholder="Username" />
                <Input name="password" placeholder="Password" password />
            </Form>
        );

        return (
            <FlexBox className="Login" center middle>
                <div className="login-box">
                    { error }
                    { form }
                </div>
            </FlexBox>
        );
    }

    onLogin({ username, password }) {
        // Dispatch the USER_LOGIN action and attempt to log the user in.
        this.props.login(username, password);
    }
}

export default connect(Login.selector, Login.actions)(Login);