import "../../../style/Login.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { FlexBox } from "../ui/layout";
import { Form, Input } from "../ui/input";

class Login extends Component {
    static actions = {
        login: actions.User.login
    };

    render() {
        return (
            <FlexBox className="Login" center middle>
                <div className="login-box">
                    <Form button="Login" onSubmit={::this.props.login}>
                        <Input name="username" placeholder="Username" />
                        <Input name="password" placeholder="Password" password />
                    </Form>
                </div>
            </FlexBox>
        );
    }
}

export default connect(null, Login.actions)(Login);