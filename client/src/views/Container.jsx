import "../../style/views/Container.scss";
import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default class Container extends Component {
    render() {
        return (
            <div className="Container">
                <Header/>
                <div>{this.props.children}</div>
                <Footer/>
            </div>
        );
    }
}