export default class Action {
    constructor(type, reducer, { transformer, meta }) {
        this.type = type;
        this.reducer = reducer;
        this.transformer = transformer || (f => f);
        this.meta = meta || (f => f || {});
    }

    creator() {
        let actionCreator = (...args) => {
            let payload = this.transformer(...args);
            let meta = this.meta(...args);
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
        this.reducer.handleAction(this.type, handler);
    }

    handleError(handler) {
        this.reducer.handleError(this.type, handler);
    }
}