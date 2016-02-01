/*
 * Simple reducer classes that makes combining them a breeze.
 *
 * Example:
 *
 *  export default const user = new Reducer("user", {});
 *
 *  user.handleAction('USER_LOGIN', (state, payload, options) => {
 *      
 *  });
 */
export default class Reducer {
    /**
     * Create a new reducer and insert it under the `propName`,
     * under the parent reducer. If a master reducer is specified,
     * any Reducer functionality such as handling actions is not available
     * 
     * @param  {String}   name          The name of the reducer in the state.
     * @param  {Any}      initialState  The initial state of the reducer.
     * @param  {Function} reducer       The master reducer function. Receives (state, action)
     */
    constructor(name, initialState, reducer) {
        if(!name)
            throw new Error("Please specify a name for reducer.");

        if(typeof initialState === "undefined")
            throw new Error(`Please specify an initial state for the reducer '${name}'.`);

        this.name = name;
        this.initialState = initialState;
        this.actionHandlers = {};
        this.errorHandlers = {};
        
        if(reducer) // Register a master reducer
            this.reducer = reducer;
    }

    /**
     * Return the name of the current reducer.
     * 
     * @return {String} The reducer name.
     */
    getName() {
        return this.name;
    }

    /**
     * Reduce the state using the current reducer.
     * 
     * @param  {Any} state     The current state.
     * @param  {Object} action The action object.
     * @return {Any}           The reduced state.
     */
    apply(state, action) {
        if(this.reducer) return this.reducer.apply(null, state, action);
        else return this.reduce(state, action);
    }

    /**
     * Handle an dispatched action.
     *
     * The handler receives three arguments:
     *     {Any}    state    The current state.
     *     {Any}    payload  The payload of the action.
     *     {Object} options  The options/meta of the action.
     *
     * These action handles FSA (Flux Standard Actions) actions. It is *mandatory*
     * that actions follow this definition:
     *
     *      { payload: Any, meta: Object, type: String, error: Boolean }
     *
     * Where payload is the content of the action. Meta is the metadata. If error is
     * set to true, the payload must be the Error or error content. 
     * 
     * IMPORTANT: Action will not fire if error is true. Use `handleError`.
     *  
     * It's also possible to specify an object of handlers which will handle the 
     * success and error (similar to `redux-actions`). Example:
     *
     *  reducer.handleAction('FOO', {
     *      next(state, payload, options) {
     *      
     *      },
     *
     *      error(state, error, options) {
     *          
     *      }
     *  });
     *  
     * @param  {String}   actionType The action type.
     * @param  {Object|Function} handler    The action handle (state, payload, options = {}) or object of handlers { next, throw }.
     */
    handleAction(actionType, handler) {
        if(this.reducer) 
            throw new Error("Cannot specify both a master reducer in the Reducer constructor and use `handleAction`.");

        if(this.actionHandlers[actionType])
            throw new Error(`Already action handler defined for '${actionType}' in '${this.getName}' reducer.`);

        if(typeof handler === "object") {
            this.handleError(actionType, handler.error);
            handler = handler.next;
        }

        this.actionHandlers[actionType] = handler;
    }

    /**
     * Handle a errored action. See `handleAction`.
     *         
     * @param  {String}   actionType The action type.
     * @param  {Function} handler    The error handler (state, error, options).
     */
    handleError(actionType, handler) {
        if(this.errorHandlers[actionType])
            throw new Error(`Already error handler defined for '${actionType}' in '${this.getName}' reducer.`);

        this.errorHandlers[actionType] = handler;
    }

    /**
     * Reduce the state given the actions. If no handler is found,
     * the initial state is returned.
     * @param  {Any}    state  The current state.
     * @param  {Object} action The action dispatched.
     * @return {Any}           The reduced state.
     */
    reduce(state, action) {
        state = state || this.initialState;
        let handler = action.error ? this.errorHandlers[action.type] : this.actionHandlers[action.type];
        if(handler) return handler.call(this, state, action.payload, action.meta || {});
        else return state;
    }

    /**
     * Combine reducers to return a new parent reducer.
     * @param  {String}     name     The name of the final reducer.
     * @param  {...Reducer} reducers The reducers to combine.
     * @return {Reducer}             The final reducer.
     */
    static combine(name, ...reducers) {
        return new Reducer(name, (state, action) => {
            return reducers.reduce((state, reducer) => {
                state[reducer.getName()] = reducer.apply(state, action);
            }, {});
        });
    }

    /**
     * Return the reducer state to the initialState.
     *
     * Example:
     *
     *  const User = new Reducer("user", null);
     *  User.handleAction("USER_LOGIN", Reducer.initial)
     *  
     * @return {Any} The initial state.
     */
    static initial() {
        return this.initialState;
    }
}