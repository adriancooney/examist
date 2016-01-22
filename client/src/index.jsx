import "../style/Global.scss";
import React from "react";
import { render } from "react-dom";
import { Router, Route, browserHistory } from 'react-router';

import * as views from "./views";

render((
    <Router history={browserHistory}>
        <Route path="/module/:module/paper/:year/:period/parse" component={views.parser.Parser} />
        <Route path="/" component={views.templates.Container}>
            <Route path="login" component={views.pages.Login}/>
            <Route path="signup" component={views.pages.Signup} />
            
            {views.app.App}

            <Route path="*" component={views.error.Error404} />
        </Route>
    </Router>
), document.querySelector(".app"));
