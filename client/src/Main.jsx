import "../style/Global.scss";
import React from "react";
import { Router, Route, browserHistory } from "react-router";
import { Provider } from "react-redux";
import store from "./Store";
import * as views from "./views";

// The only 

// Export our app for rendering or testing.
export default (
    <Provider store={store}>
        <Router history={browserHistory}>
            {/* 
                Here we have an entirely different application on a URL. We hoist this URL out of the
                "/" route because we don't want the container.
            */}
            <Route path="/module/:module/paper/:year/:period/parse" component={views.parser.Parser} />

            <Route path="/" component={views.templates.Container}>
                <Route path="login" component={views.pages.Login} onEnter={views.pages.Login.onEnter} />
                <Route path="signup" component={views.pages.Signup} />
                
                {views.app.App}

                <Route path="*" component={views.pages.Error404} />
            </Route>
        </Router>
    </Provider>
);
