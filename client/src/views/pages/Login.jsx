import "../../../style/Login.scss";
import React, { Component } from "react";
import { FlexBox } from "../ui/layout";
import { Form, Input } from "../ui/input";

export default class Login extends Component {
    render() {
        return (
            <FlexBox className="Login" center middle>
                <div className="login-box">
                    <Form button="Login">
                        <Input placeholder="Username" />
                        <Input placeholder="Password" password />
                    </Form>
                </div>
            </FlexBox>
        );
    }
}