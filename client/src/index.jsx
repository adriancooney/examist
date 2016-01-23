import "../style/Global.scss";
import React from "react";
import { render } from "react-dom";
import { createHistory } from "history";
import { Router, Route } from "react-router";
import { syncHistory } from "redux-simple-router";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import promiseMiddleware from "redux-promise";
import { Provider } from "react-redux";
import * as reducers from "./reducers";
import * as views from "./views";

// Create our browser history using the `history` module
const browserHistory = createHistory();

const reduxRouterMiddleware = syncHistory(browserHistory);

const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

// Apply the redux-simple-router middleware
// Sidenote: This is possibly the ugliest API ever (and it's
// made by very smart people).
const createStoreFinal = compose(
    applyMiddleware(reduxRouterMiddleware, promiseMiddleware, logger),
    window.devToolsExtension ? window.devToolsExtension() : f => f // Redux Devtools extension
)(createStore)

// Create the store
const store = createStoreFinal(combineReducers(Object.assign({}, reducers)));

// Enable the devtools
reduxRouterMiddleware.listenForReplays(store)

// Render the App
render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/module/:module/paper/:year/:period/parse" component={views.parser.Parser} />
            <Route path="/" component={views.templates.Container}>
                <Route path="login" component={views.pages.Login}/>
                <Route path="signup" component={views.pages.Signup} />
                
                {views.app.App}

                <Route path="*" component={views.error.Error404} />
            </Route>
        </Router>
    </Provider>
), document.querySelector(".app"));
