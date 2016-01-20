import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import * as views from "./views";

console.log(views);

render((
    <Router history={browserHistory}>
        <Route path="/module/:module/paper/:year/:period/parse" component={views.parser.Parser} />
        <Route path="/" component={views.Container}>
            <Route path="login" component={views.Login}/>
            <Route path="signup" component={views.Signup} />
            <IndexRoute component={views.app.App} /* onEnter={requireAuth} */>
                <IndexRoute component={views.app.Dashboard} />
            </IndexRoute>
        </Route>
    </Router>
), document.querySelector(".app"));
