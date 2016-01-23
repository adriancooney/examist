import { browserHistory } from "react-router";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { syncHistory } from "redux-simple-router";
import promiseMiddleware from "redux-promise";
import * as reducers from "./reducers";

// Add redux-simple-router
const reduxRouterMiddleware = syncHistory(browserHistory);

// Compose the createStore function (wat api).
const createStoreFinal = compose(
    // Apply our middleware from redux-simple-router and redux-promise
    applyMiddleware(reduxRouterMiddleware, promiseMiddleware),

    // Redux Devtools extension
    window.devToolsExtension ? window.devToolsExtension() : f => f 
)(createStore)

// Create the final store
const store = createStoreFinal(combineReducers(Object.assign({}, reducers)));

// Enable the devtools
reduxRouterMiddleware.listenForReplays(store)

export default store;