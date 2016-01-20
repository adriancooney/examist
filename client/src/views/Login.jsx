import React, { Component } from "react";

export default class Login extends Component {
    render() {
        return (
            <div className="Login">
                <input type="text" placeholder="Username"/>
                <input type="password" placeholder="Password"/>
                <input type="submit" value="submit"/>
            </div>
        );
    }
}