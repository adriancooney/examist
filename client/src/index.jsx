import React from "react";
import { render } from "react-dom";
import { Router, Route, browserHistory } from 'react-router';

import * as views from "./views";

render((
    <Router history={browserHistory}>
        <Route path="/module/:module/paper/:year/:period/parse" component={views.parser.Parser} />
        <Route path="/" component={views.Container}>
            <Route path="login" component={views.Login}/>
            <Route path="signup" component={views.Signup} />
            
            {views.app.App}
        </Route>
    </Router>
), document.querySelector(".app"));
