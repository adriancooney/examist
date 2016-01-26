import { browserHistory } from "react-router";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { syncHistory } from "redux-simple-router";
import { promiseMiddleware } from "redux-pending";
import * as reducers from "./reducers";

// Redux middleware 
let middleware = [
    promiseMiddleware,
    syncHistory(browserHistory),
    () => next => action => {
        console.log(`Dispatch: ${action.type}`, action.payload);
        return next(action);
    }
];

// CreateStore composition
let composition = [
    applyMiddleware(...middleware)
];

// Add in the redux dev tools chrome extension
if(__DEV__ && typeof window !== "undefined" && window.devToolsExtension) composition.push(window.devToolsExtension())

// Compose the createStore function
const createStoreFinal = compose(...composition)(createStore)

// Create the final store
const store = createStoreFinal(combineReducers(reducers));

// Enable the devtools for redux-simple-router
if(__DEV__) middleware[1].listenForReplays(store);

/**
 * Perform a selection on the current state using a selector or an object
 * of selectors. e.g.
 *
 *  select({ user: (state) => state.user, filter: (state) => state.filter });
 *  
 * @param  {Function|Object} selector A selector function or map of key:selector.
 * @return {Any}                      Value from the store.
 */
export function select(selector) {
    const state = store.getState();

    if(typeof selector === "function") return selector(state);
    else if(typeof selector === "object") {
        return Object.keys(selector).reduce((selection, key) => {
            selection[key] = selector[key](state);
            return selection;
        }, {});
    }
}

export default store;