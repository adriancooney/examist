import { browserHistory, createMemoryHistory } from "react-router";
import { createStore, applyMiddleware, compose } from "redux";
import { syncHistory } from "redux-simple-router";
import { promiseMiddleware } from "redux-pending";
import Debug from "debug";
import { DEBUG, TEST } from "./Config";
import rootReducer from "./model";

const debug = Debug("examist:dispatch");

// Redux middleware 
let middleware = [
    promiseMiddleware,
    syncHistory(TEST ? createMemoryHistory() : browserHistory)
];

if(DEBUG) {
    middleware.push(() => next => action => {
        debug(`%c${action.type}`, "font-weight: bold; " + (action.error ? "color: red;" : ""), action.payload);
        return next(action);
    });
}

// CreateStore composition
let composition = [
    applyMiddleware(...middleware)
];

// Add in the redux dev tools chrome extension
if(DEBUG && typeof window !== "undefined" && window.devToolsExtension) 
    composition.push(window.devToolsExtension())

// Compose the createStore function
const createStoreFinal = compose(...composition)(createStore)

// Create the final store
const store = createStoreFinal(rootReducer.getReducer());

// Link the store back to the root reducer
// so we can automatically getState on each
// reducer.
rootReducer.linkStore(store);

// Enable the devtools for redux-simple-router
if(DEBUG) 
    middleware[1].listenForReplays(store);

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