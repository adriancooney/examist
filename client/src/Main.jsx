import "../style/Global.scss";
import React from "react";
import { Router, Route, browserHistory } from "react-router";
import { Provider } from "react-redux";
import store from "./Store";
import * as views from "./views";
import { Root } from "./views";

// Export our app for rendering or testing.
export default (
    <Provider store={store}>
        <Root>
            <Router history={browserHistory}>
                {/*
                    Here we have an entirely different application on a URL. We hoist this URL out of the
                    "/" route because we don't want the container.
                */}
                <Route path="/course/:course/paper/:year/:period/parse" component={views.parser.Parser} />

                <Route path="/" component={views.templates.Container}>
                    <Route path="login" component={views.pages.Login} onEnter={views.pages.Login.onEnter} />
                    <Route path="signup" component={views.pages.Signup} onEnter={views.pages.Signup.onEnter}/>
                    
                    {views.app.App}

                    <Route path="*" component={views.pages.Error404} />
                </Route>
            </Router>
        </Root>
    </Provider>
);