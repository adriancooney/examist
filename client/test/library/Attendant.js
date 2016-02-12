import { EventEmitter } from "events";

export default class Attendant extends EventEmitter {
    constructor(store, reducer) {
        super();

        this.store = store;
        this.reducer = reducer;

        store.replaceReducer((state, action) => {
            const nextState = reducer(state, action);
            this.emit(action.type, state, action, nextState);
            return nextState;
        });
    }

    dispatch(...args) {
        return this.store.dispatch(...args);
    }
}