import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import views from "./views";
import pages from "./pages";

render((
    <Router history={browserHistory}>
        <Route path="/" component={views.Container}>
            <IndexRoute component={pages.Home} />
            <Route path="about" component={pages.About}/>
            <Route path="login" component={pages.Login}/>
        </Route>
    </Router>
), document.querySelector(".app"));
