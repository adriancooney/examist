import { selector } from "./library/Selector";

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

/** @type {Function} Legacy */
export const mapSelectors = selector;

/**
 * Create a network action that has no unintended side-effects if it
 * fails. If the fatal falg is set to true and the request fails, an
 * error page is displayed. The request is also unauthorized unless 
 * specified by the authorized flag.
 * @param  {String}   actionType The action type.
 * @param  {Function} callback   Callback.
 * @param  {Boolean}  authorized Flag whether or not the request is authorized. (Default false).
 * @param  {Boolean}  fatal      Flag whether or not the request is fatal. (Default false).
 * @return {Function}            Action creator.
 */
// export function createRequestAction(actionType, callback, authorized = false, fatal = false) {
//     return createAction(actionType, (...args) => {
//         if(callback) {
//             if(authorized) return callback(select(api), ...args);
//             else return callback(...args);
//         }
//     }, () => ({ network: true, fatal }));
// }

/**
 * Create a fatal request action that if it fails, displays
 * an error screen related to the request. e.g. Attempting to
 * find the `/about` page results in a 404. The request is
 * unauthorized.
 * 
 * @param  {String}   actionType The action type.
 * @param  {Function} callback   Callback with args.
 * @return {Function}            Action creator.
 */
// export function createFatalRequestAction(actionType, callback) {
//     return createAction(actionType, callback, false, true);
// }

/**
 * Create an authorized request (non-fatal). The callback is
 * passed an authenticated API instance for usage with the
 * request. This requires the user to be logged in.
 *
 * e.g. 
 *
 *     const getModules = createAuthorizedRequestAction("GET_MODULES", (api) => api.getModules())
 *     
 * @param  {String}   actionType Action type.
 * @param  {Function} callback   Callback with (api, ...args).
 * @return {Function}            Action creator.
 */
// export function createAuthorizedRequestAction(actionType, callback) {
//     return createRequestAction(actionType, callback, true);
// }

/**
 * Create an authorized and fatal request action. Combination of
 * `createFatalRequestAction` and `createAuthorizedRequestAction`.
 * 
 * @param  {String}   actionType Action Type.
 * @param  {Function} callback   Callback with args.
 * @return {Function}            Action creator.
 */
// export function createFatalAuthorizedRequestAction(actionType, callback) {
//     return createRequestAction(actionType, callback, true, true);
// }

/**
 * Use react proptypes to validate data.
 * @param  {Object} config     Map of valueName:type.
 * @param  {Object} data       Map of data to validate.
 * @return {Promise} -> {Any}  Resolves value returned from callback.
 */
export function validate(config, data) {
    // All for omitted of type and force all the data values to be a required string
    if(typeof data === "undefined") {
        data = config;
        config = Object.keys(data).reduce((shape, prop) => {
            shape[prop] = types.string;
            return shape;
        }, {});
    }

    config = typeof config === "object" ? types.shape(config) : config;
 
    // Apply the type
    let typeError = config(data);

    // Resole or reject tge promise
    if(typeError) return Promise.reject(typeError);
    else return Promise.resolve(data);
}

/**
 * Extended `typeof` operator with support for arrays and RegExp.
 * @param  {Any} value The value to check.
 * @return {String}       Type.
 */
export function typeOf(value) {
    if(Array.isArray(value)) return "array";
    else if(value instanceof RegExp) return "regexp";
    else return typeof value;
}

/**
 * Apply a value to a type optionally.
 * @param  {Function}       checker The type function.
 * @param  {Any}            value   The value to supply to the type function.
 * @return {TypeError|Null}         Null or TypeError.
 */
const optionalType = (checker, value) => {
    let error = checker(value);

    if(error instanceof TypeError) return error;
    else return null; // Ignore "not found " errors
};

/**
 * Create a new type function.
 * @param  {Function} typeFunc The type function which returns:
 * @param  {String}   typeName The name of the type.
 * @return {Function}          The binded type func.
 */
const type = (typeFunc, typeName) => {
    let truthy = typeName === "string" ? 
        value => !!value : // This means the empty string will be false!
        value => typeof value !== "undefined";

    const checker = (value, ref) => {
        let result = truthy(value) ? typeFunc(value, ref) : Object.assign(new Error(`Required value for type '${typeName}' not found.`), { ref });

        if(result instanceof Error) return result;
        else if(result === false) {
            let actual = typeOf(value), expected = typeName;
            return Object.assign(new TypeError(`Invalid type of '${typeOf(value)}' supplied${ref ? " to " + ref : ""}, expected type '${typeName}'.`),
                { ref, actual, expected });
        } else return null; // Successful match
    };

    checker.optional = optionalType.bind(null, checker);

    return checker;
};

/**
 * Create a type factory.
 * @param  {Function} creator The type creator.
 * @return {Function}         The binded type creator.
 */
const typeFactory = (creator) => {
    creator.optional = (...args) => optionalType.bind(null, creator(...args));
    return creator;
};

/**
 * Type checkers. If a type checker below returns false, the modifier
 * below will convert that to a validation error.
 * 
 * @type {Object}
 */
export const types = {
    string: type(value => typeof value === "string", "string"),
    number: type(value => typeof value === "number", "number"),
    bool: type(value => typeof value === "boolean", "bool"),
    array: type(value => Array.isArray(value), "array"),
    object: type(value => !Array.isArray(value) && typeof value === "object", "object"),
    func: type(value => typeof value === "function", "func"),

    shape: typeFactory(descriptor => {
        Object.keys(descriptor).forEach(key => {
            if(typeof descriptor[key] !== "function") 
                throw new Error(`Value passed to shape type under key '${key}' must be a type function.`);
        });

        return type((value, ref) => {
            if(Array.isArray(value) || typeof value !== "object") 
                return new TypeError(`Invalid type of '${typeOf(value)}' supplied${ref ? " to '" + ref + "'": ""}, expected 'object' of shape.`);

            return Object.keys(descriptor)
                .reduce((error, key) => error || descriptor[key](value[key], ref ? ref + "." + key : key), null);
        }, "shape", true);
    })
};
