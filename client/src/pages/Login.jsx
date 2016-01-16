import React, { Component } from "react";
import { Button } from "../components"

import models from "../models";

export default class Login extends Component {
    render() {
        return (
            <div className="Login">
                <input type="text" onChange={this.onChange.bind(this)} placeholder="Username"/>
                <input type="password" onChange={this.onChange.bind(this)} placeholder="Password"/>
                <input type="submit" onClick={this.onSubmit.bind(this)} value="submit"/>
            </div>
        );
    }

    onChange() {

    }

    onSubmit() {
        models.User.login(username, password).then(() => {
            navigate("/");
        }).catch(() => {

        });
    }
}