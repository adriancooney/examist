import "../../../style/Login.scss";
import React, { Component } from "react";
import { FlexBox, Input, Form } from "../ui/layout";

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