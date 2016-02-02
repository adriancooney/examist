import Action from "./Action";

const REDUCER_RESET = "@@REDUCER/RESET_ACTION";

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

        if(typeof initialState === "function") {
            reducer = initialState;
            initialState = undefined;
        }

        if(!reducer && typeof initialState === "undefined")
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
        if(this.reducer) return this.reducer.call(null, state, action);
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
            throw new Error(`Cannot specify both a master reducer in the Reducer constructor and use \`handleAction\` in '${this.name}' reducer.`);

        if(typeof actionType === "function" && actionType.type)
            actionType = actionType.type;

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
        if(typeof actionType === "function" && actionType.type)
            actionType = actionType.type;
        
        if(this.errorHandlers[actionType])
            throw new Error(`Already error handler defined for '${actionType}' in '${this.getName}' reducer.`);

        this.errorHandlers[actionType] = handler;
    }

    /**
     * Create a new action and return the action creator.
     *
     * Creates a new action and allows specifying handlers right from the creator. Example:
     *
     *  const getUser = reducer.createAction("GET_USER", API.getUser).handle((state, user) => {
     *      return { user }
     *  });
     *
     *  // The use like
     *  getUser("billy");
     *  
     * @param  {String}   type    The action type.
     * @param  {Function} creator The action creator (Default value => value).
     * @param  {Function}   meta  The meta creator (Default value => value).
     * @return {Function}         Action creator.
     */
    createAction(type, creator, meta) {
        return (new Action(type, this, { creator, meta })).creator();
    }

    /**
     * Add a reset action that when dispatched, resets the reducer's state
     * to the initial state.
     *
     * It's possible to use this on combined reducers!
     * 
     * @param  {String} type The action type.
     */
    resetAction(type) {
        if(typeof type === "function" && type.type) type = type.type;
        this.resetActionType = type;
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
        if(action.type === this.resetActionType) return this.initialState;
        else if(handler) return handler.call(this, state, action.payload, action.meta || {});
        else return state;
    }

    /**
     * Get the reducer to pass to Redux.
     * @return {Function} The reducer.
     */
    getReducer() {
        return this.apply.bind(this);
    }

    /**
     * Given the global state, select the current reducers state. This is
     * a slightly abstract concept and requires certain conditions to be
     * true for it to work:
     *     * Requires all reducers to be combined via Reducer.combine.
     *     * Requires root reducer to be called "root" (omit name argument 
     *       in Reducer.combine).
     *
     * This works by traversing all the way up the reducer tree, grabbing
     * the reducers own state and returning it back the way down, recursively
     * selecting only it's part and handing it to the child. The root reducer
     * is a special case which returns the whole state.
     * 
     * @param  {Any} currentstate The current state.
     * @return {Any}              The reducers current state.
     */
    getState(currentState) {
        if(this.__parent) currentState = this.__parent.getState(currentState);
        return this.name === "root" ? currentState : currentState[this.name];
    }

    /**
     * Create a selector scoped to the current reducer.
     * @param  {Function} selector The selector function on the reducer's state.
     * @return {Function}          The scoped selector function.
     */
    select(selector) {
        return state => selector(this.getState(state));
    }

    /**
     * Combine reducers to return a new parent reducer.
     * @param  {String}     name     The name of the final reducer.
     * @param  {...Reducer} reducers The reducers to combine.
     * @return {Reducer}             The final reducer.
     */
    static combine(name, ...reducers) {
        if(name instanceof Reducer) {
            reducers.push(name);
            name = "root";
        }

        let root = new Reducer(name, {}, (state, action) => {
            // Reset the state if it's a reset action
            if(root.resetActionType === action.type) {
                state = undefined;
                action = { type: REDUCER_RESET };
            }

            return reducers.reduce((nextState, reducer) => {
                nextState[reducer.getName()] = reducer.apply(state, action);
                return nextState;
            }, {});
        });

        // Set a parent reference on the reducer
        reducers.forEach(reducer => reducer.__parent = root);

        return root;
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