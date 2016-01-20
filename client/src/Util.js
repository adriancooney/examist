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