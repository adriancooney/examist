import { createAction } from "redux-actions";
import { select } from "./Store";
import { api } from "./selectors/User";

/**
 * Create a simple String enum. Useful for usage
 * with Redux since Symbols aren't serializable.
 * @param {...String} constants The string constants.
 * @return {Object} Each property corresponds to the constant.
 */ 
export function Enum(...constants) {
    let num = {}

    constants.forEach((constant) => {
        num[constant] = constant;
    });

    return Object.freeze(num);
}

/**
 * Map selectors to the state.
 * @param  {Object} map   Map of key -> state.
 * @return {Function}     Selector.
 */
export function mapSelectors(map) {
    return state => Object.keys(map).reduce((props, key) => {
        props[key] = map[key](state);
        return props;
    }, {});
}

/**
 * Create a network action that when fails, displays an error page.
 * @param  {String}   actionType The action type.
 * @param  {Function} callback   Callback with the API.
 * @return {Function}            Action creator.
 */
export function createNetworkAction(actionType, callback) {
    return createAction(actionType, (...args) => callback(select(api), ...args), () => ({ network: true }));
}

export function validate(callback) {
    return new Promise(resolve => {
        callback();
        resolve();
    });
}