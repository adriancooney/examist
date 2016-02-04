/**
 * Map selectors to the state.
 * @param  {Object} map   Map of key -> state.
 * @return {Function}     Selector.
 */
export function selector(map) {
    const keys = Object.keys(map);

    // Ensure we have all functions
    keys.forEach(key => {
        if(typeof map[key] !== "function")
            throw new Error(`All selectors passed in \`selector\` map must be functions. '${key}' is not.`);
    });

    return state => keys.reduce((props, key) => {
        props[key] = map[key](state);
        return props;
    }, {});
}

/**
 * Apply a waterfall selector to a state. A waterfall
 * selector takes in multiple different selectors and
 * reduces them by taking the result of each selector
 * and passing it to the next.
 * 
 * @param  {...Function} selectors The selectors.
 * @return {Function}              The final selector.
 */
export function waterfall(...selectors) {
    return state => 
        selectors.reduce((nextState, selector) => selector(nextState), state);
}

/**
 * The collapse function is similar to the waterfall selector
 * except if any of the selectors return `null`, it exits and
 * returns null.
 * 
 * @param  {...Function} selectors The selectors.
 * @return {Function}              The final selector.
 */
export function collapse(...selectors) {
    return state => selectors.reduce((nextState, selector) => {
        return nextState === null || typeof nextState === "undefined" ? null : selector(nextState)
    }, state);
}

/**
 * Reduce the selectors by passing the returned value from
 * each selector's return value to creator function and then the state to
 * the returned selector
 * @param  {Any}         initial   The initial value.
 * @param  {...Function} selectors The selectors.
 * @return {Function}              The final selector.
 */
export function reduce(initial, ...selectorCreators) {
    return state => selectorCreators.reduce((selectorValue, selectorCreator) => {
        return selectorCreator(selectorValue)(state);
    }, initial);
}

/**
 * Compose selector creator functions. Returns function
 * that passes first value as the initial value in a 
 * selector creator reduce.
 *     
 * @param  {...Function} selectorCreator The chained selector creators.
 * @return {Function}                    The final selector.
 */
export function compose(...selectorCreators) {
    return initial => state => selectorCreators.reduce((selectorValue, selectorCreator) => {
        if(selectorValue === null || typeof selectorValue === "undefined") return null;
        else return selectorCreator(selectorValue)(state);
    }, initial);
}