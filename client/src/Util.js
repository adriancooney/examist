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
 * Determine whether a function is a generator or not.
 * Nabbed from: https://github.com/tj/co/blob/master/index.js#L220-L225
 * @param  {Any}         obj The value to determine if generator or not.
 * @return {Boolean}     Generator or not.
 */
export function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    if (!constructor) return false;
    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
}

/**
 * Check if `obj` is a generator.
 * @param  {Mixed}   obj The object to check.
 * @return {Boolean} Whether or not generator.
 */
export function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

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
