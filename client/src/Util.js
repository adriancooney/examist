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

export function mapSelectors(map) {
    return state => Object.keys(map).reduce((props, key) => {
        props[key] = map[key](state);
        return props;
    }, {});
}

export function createNetworkAction(actionType, callback) {
    return createAction(actionType, () => callback(select(api)), () => ({ network: true }));
}