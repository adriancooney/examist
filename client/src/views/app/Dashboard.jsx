import "../../../style/app/Dashboard.scss"
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { isPending } from "redux-pending";
import { mapSelectors } from "../../Util";
import { Loading } from "../ui/";
import { ModuleList } from "../ui/module/";
import * as selectors from "../../selectors";
import * as actions from "../../actions";

class Dashboard extends Component {
    static selectors = {
        user: selectors.User.current,

        // Loading states of our actions.
        isLoadingModules: isPending(actions.User.types.USER_MODULES)
    };

    static actions = {
        getModules: actions.User.getModules
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

export default connect(mapSelectors(Dashboard.selectors), Dashboard.actions)(Dashboard);