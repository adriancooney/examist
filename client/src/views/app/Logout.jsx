import React, { Component } from "react";
import { connect } from "react-redux";

const LOGOUT_REDIRECT = "/login";

class Logout extends Component {
    componentDidMount() {
        this.props.logout();
    }

    componentWillReceiveProps(props) {
        // Once we log in, this component will recieve a user property from the current
        // state. When that happens, it means we have successfully logged in and we
        // can redirect to the location passed in the location.state or LOGIN_REDIRECT.
        if(!props.user)
            this.props.push(LOGOUT_REDIRECT);
    }

    render() {
        return (
            <div className="Logout">
                <p>Logging out.</p>
            </div>
        );
    }
}

export default connect(state => ({ 
    user: selectors.User.current(state) 
}), {
    // logout: actions.User.logout,
    // push: actions.Routing.push
})(Logout)