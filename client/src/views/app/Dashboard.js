import React, { Component } from "react";
import { Module } from "./components";

export default class Dashboard extends Component {
    render() {
        let modules = Array.apply(null, { length: 5})
            .map((v, i) => <Module key={i} name={`CT${Math.floor(Math.random()*1000).toString()}`}/>);

        return (<div className="Dashboard">
            <h3>Dashboard</h3>
            <div>
                { modules }
            </div>
        </div>);
    }
}