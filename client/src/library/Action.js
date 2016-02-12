import co from "co";
import { isGeneratorFunction } from "../Util";

export default class Action {
    constructor(type, { reducer, transformer, meta } = {}) {
        this.type = type;
        this.reducer = reducer;
        this.meta = meta || (() => ({}));

        // Add some generator support
        if(transformer && isGeneratorFunction(transformer)) transformer = co.wrap(transformer);
        else if(!transformer) transformer = (f => f);

        this.transformer = transformer;
    }

    /**
     * Return an action creator function. If a reducer has been linked
     * to this Action then the chaining of `handle` and `handleError` are
     * enabled which will attach the current actionHandler to handle
     * the action.type. The creator also has a `type` attribute which returns
     * the action type (useful to passing to Reducer.handleAction and co).
     * 
     * @return {Function} Returns the action creator.
     */
    creator() {
        let actionCreator = (...args) => {
            const payload = this.transformer(...args);
            const meta = this.meta(...args);
            console.log("PAYLOAD", payload instanceof Promise);
            return this.toObject(payload, meta);
        }

        // Use for chaining.
        actionCreator.handle = handler => { this.handle(handler); return actionCreator; }
        actionCreator.handleError = handler => { this.handleError(handler); return actionCreator; }
        actionCreator.type = this.type;
        return actionCreator;
    }

    toObject(payload, meta) {
        return { type: this.type, payload, meta }
    }

    handle(handler) {
        if(!this.reducer) 
            throw new Error("Actions cannot be handled direcly unless created from a reducer. See Reducer#createAction.");

        this.reducer.handleAction(this.type, handler);
    }

    handleError(handler) {
        if(!this.reducer) 
            throw new Error("Errored actions cannot be handled direcly unless created from a reducer. See Reducer#handleError.");

        this.reducer.handleError(this.type, handler);
    }
}