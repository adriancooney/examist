import App from "./App";
import React from "react";
import { render } from "react-dom";
import { Router, Route, browserHistory } from 'react-router';


render((
    <Router history={browserHistory}>
        <Route path="/" component={App} />
    </Router>
), document.querySelector(".app"));
