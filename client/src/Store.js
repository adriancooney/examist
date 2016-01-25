import { browserHistory } from "react-router";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { syncHistory } from "redux-simple-router";
import promiseMiddleware from "redux-promise";
import * as reducers from "./reducers";

// Redux middleware 
let middleware = [
    promiseMiddleware,
    syncHistory(browserHistory)
];

// CreateStore composition
let composition = [
    applyMiddleware(...middleware),
];

// Add in the redux dev tools chrome extension
if(__DEV__ && typeof window !== "undefined" && window.devToolsExtension) composition.push(window.devToolsExtension())

// Compose the createStore function
const createStoreFinal = compose(...composition)(createStore)

// Create the final store
const store = createStoreFinal(combineReducers(reducers));

// Enable the devtools for redux-simple-router
if(__DEV__) middleware[1].listenForReplays(store)

export default store;