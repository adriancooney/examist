import React, { Component } from "react";
import { connect } from "react-redux";
import API, { HTTPError } from "../API";
import { BROWSER, DEBUG } from "../Config";
import * as User from "../model/User";

class Root extends Component {
    static actions = {
        restore: User.restore
    };

    state = {
        pendingLogin: false
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
            const updateState = (error) => {
                // This set state call is essentially the initiator for the entire
                // app. Is "renders" the route (i.e. routes) and thus initiates the
                // whole view so this call is *heavy*. Since this is only called 
                // within the promise too, any errors render the app are then swallowed
                // never to be found. This function is called for the resolving and
                // rejection of the promise. This is due to the fact that we still 
                // render the app if the API throws a 401 unauthorized. To ensure we
                // don't swallow the other errors, we check to see if the error isn't
                // an instance of the HTTPError. If it's just a normal error, we
                // throw it and the lack of the second rejection handler will ensure
                // the error propagates as it would outside of the promise at all.
                if(error instanceof Error && !(error instanceof HTTPError)) {
                    // Since the error logging in Chrome sucks for uncaught in
                    // errors, we'll help it out a little.
                    if(DEBUG) console.error(error.stack);

                    throw error;
                }

                this.setState({ pendingLogin: false });
            }

            this.setState({ pendingLogin: true });
            API.fromAuthKey(key)
                .then(this.props.restore) // Restore the user
                .then(updateState) // Render the router regardless of outcome,
                .catch(updateState); // we let the middleware handling things from then on.
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