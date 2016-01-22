import "../../../style/app/Dashboard.scss"
import React, { Component } from "react";
import { Link } from "react-router";
import { range } from "lodash/util";
import { ModuleList } from "../ui/module/";

export default class Dashboard extends Component {
    render() {
        let modules = range(6).map(() => {
            return {
                code: "CT" + Math.floor(Math.random() * 1000)
            }
        });

        return (
            <div className="Dashboard">
                <h2>Your Modules <Link to="#">edit</Link></h2>
                <ModuleList modules={ modules } />
            </div>
        );
    }
}