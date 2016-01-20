import React, { Component } from "react";
import { Link } from "react-router";

export default class Module extends Component {
    render() {
        return (<div className="Module">
            <h1><Link to={`/module/${this.props.name}`}>{this.props.name}</Link></h1>
        </div>);
    }
}