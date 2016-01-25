import "../../../style/Login.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { FlexBox } from "../ui/layout";
import { Form, Input } from "../ui/input";
import { Loading } from "../ui";

class Login extends Component {
    static actions = {
        login: actions.User.login,
        loading: actions.User.loading
    };

    static selector = (state) => ({
        user: state.user
    });

    render() {
        let form = this.props.user && this.props.user.loading ? <Loading /> : (
            <Form button="Login" onSubmit={::this.onLogin}>
                <Input name="username" placeholder="Username" />
                <Input name="password" placeholder="Password" password />
            </Form>
        );

        return (
            <FlexBox className="Login" center middle>
                <div className="login-box">{ form }</div>
            </FlexBox>
        );
    }

    onLogin({ username, password }) {
        this.props.loading()
        this.props.login(username, password);
    }
}

export default connect(Login.selector, Login.actions)(Login);