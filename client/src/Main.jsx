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
                {views.parser.routes}

                <Route path="/" component={views.templates.Container}>
                    <Route path="about" component={views.pages.About} />
                    <Route path="login" component={views.pages.Login} onEnter={views.pages.Login.onEnter} />
                    <Route path="signup" component={views.pages.Signup} onEnter={views.pages.Signup.onEnter}/>
                    
                    {views.app.routes}

                    <Route path="*" component={views.pages.Error404} />
                </Route>
            </Router>
        </Root>
    </Provider>
);