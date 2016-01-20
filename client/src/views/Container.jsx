import "../../style/views/Container.scss";
import React, { Component } from "react";
import { Header, Footer } from "./template";

export default class Container extends Component {
    render() {
        return (
            <div className="Container">
                <Header />
                <div>{this.props.children}</div>
                <Footer />
            </div>
        );
    }
}