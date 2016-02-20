import React, { Component } from "react";
import { connect } from "react-redux";
import API from "../API";
import { BROWSER } from "../Config";
import * as User from "../model/User";

class Root extends Component {
    static actions = {
        restore: User.restore
    };

    state = {
        pendingLogin: true
    };

    /*
     * This is where we restore a user's session if we find the session
     * key in localstorage. Since this component is only ever mounted
     * once, this is triggered only once. It will NEVER have a user prop
     * on mount, only if we verify the session key.
     *
     * It's unfortunate we had to circumvent Redux's principles here of
     * keeping our actions contained in our model/ directory. The reason
     * we make an API call here (and it's the only time we will unless
     * we hit the same problem) is because of how react-router-redux 
     * works. It does not allow for updating the location in response
     * to actions which is kinda sucky.
     */
    componentWillMount() {
        const key = this.getUserKey();

        if(key) {
            const updateState = () => this.setState({ pendingLogin: false });
            API.fromAuthKey(key)
                .then(this.props.restore)
                .then(updateState)
                .catch(updateState);
        }
    }

    /**
     * Simple Isomorphic function that returns the session key
     * from localstorage if it exists. Since localstorage doesn't
     * exist serverside, we have to authenticated manually.
     * 
     * @return {String} Session key or null if none.
     */
    getUserKey() {
        return BROWSER ? window.localStorage.sessionKey : null;
    }

    render() {
        if(this.state.pendingLogin) {
            return <div>Logging you in. One second..</div>;
        } else return this.props.children;
    }
}

export default connect(undefined, Root.actions)(Root);