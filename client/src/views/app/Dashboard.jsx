import "../../../style/app/Dashboard.scss"
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { isPending } from "redux-pending";
import * as model from "../../model";
import { selector } from "../../Util";
import { Loading } from "../ui/";
import { ModuleList } from "../ui/module/";

class Dashboard extends Component {
    static selectors = selector({
        user: model.User.selectCurrent,

        // Loading states of our actions.
        isLoadingModules: isPending(model.User.getModules.type)
    });

    static actions = {
        getModules: model.User.getModules
    };

    componentWillMount() {
        // If our user modules is null, it means we haven't attempted to load them
        // yet. If it's empty, it means the user has no modules.
        if(!this.props.user.modules)
            this.props.getModules();
    }

    render() {
        let modules = !this.props.user.modules || this.props.isLoadingModules ? 
            <Loading /> : <ModuleList modules={this.props.user.modules} />;

        return (
            <div className="Dashboard">
                <h2>Your Modules <Link to="#">edit</Link></h2>
                { modules }
            </div>
        );
    }
}

export default connect(Dashboard.selectors, Dashboard.actions)(Dashboard);