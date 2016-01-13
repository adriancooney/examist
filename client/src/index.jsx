import App from "./App";
import React from "react";
import views from "./views";
import { render } from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={views.Home} />
        </Route>
    </Router>
), document.querySelector(".app"));
