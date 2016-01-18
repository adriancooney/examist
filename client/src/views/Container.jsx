import "../../style/views/Container.scss";
import React, { Component } from "react";
import View from "../View";
import Header from "./elements/Header";
import Footer from "./elements/Footer";

export default class Container extends View {
    getInitialState() {
        return this.load({ "user": User })
    }

    render() {
        return (
            <div className="Container">
                <Header user={this.state.user}/>
                <div>{this.props.children}</div>
                <Footer/>
            </div>
        );
    }
}