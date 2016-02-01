import Reducer from "../../../src/library/Reducer";
import assert from "assert";

describe.only("Reducer", () => {
    describe("constructor", () => {
        it("should error when no name is passed", () => {
            assert.throws(() => new Reducer(), /name/i);
        });

        it("should error when no initialState is passed", () => {
            assert.throws(() => new Reducer("foo"), /foo/i);
        });

        it("should create a new reducer instance", () => {
            const initialState = {};
            const name = "Foo";

            const reducer = new Reducer(name, initialState);
            assert.equal(reducer.name, name);
            assert.equal(reducer.initialState, initialState);
        });
    });

    describe("#getName", () => {
        it("should return the name of the reducer", () => {
            assert.equal((new Reducer("foo", {})).getName(), "foo");
        });
    });

    describe("#handleError", () => {
        it("should add an action handler to the reducer", () => {
            const handler = () => {};
            const r = new Reducer("foo", {});
            r.handleError("FOO", handler);
            assert.equal(r.errorHandlers["FOO"], handler);
        });

        it("should not let me add two handlers for the same action", () => {
            const r = new Reducer("foo", {});
            r.handleError("FOO", () => {});

            assert.throws(r.handleError.bind(r, "FOO", () => {}));
        });
    });

    describe("#handleAction", () => {
        it("should add an action handler to the reducer", () => {
            const handler = () => {};
            const r = new Reducer("foo", {});
            r.handleAction("FOO", handler);
            assert.equal(r.actionHandlers["FOO"], handler);
        });

        it("should add an object of handlers", () => {
            const next = () => {};
            const error = () => {};

            const r = new Reducer("foo", {});
            r.handleAction("FOO", { next, error });
            assert.equal(r.actionHandlers["FOO"], next);
            assert.equal(r.errorHandlers["FOO"], error);
        });

        it("should not let me add two handlers for the same action", () => {
            const r = new Reducer("foo", {});
            r.handleAction("FOO", () => {});

            assert.throws(r.handleAction.bind(r, "FOO", () => {}));
        });
    });

    describe("#reduce", () => {
        it("should correctly pass the initialState to actions and empty meta object when absent", next => {
            const initialState = {};
            const r = new Reducer("foo", initialState);

            r.handleAction("FOO", function(state, payload, meta) {
                assert.equal(this, r);
                assert.equal(initialState, state);
                assert(meta); // Ensure meth
                next();
            });

            r.reduce(undefined, { type: "FOO" });
        });

        it("should pass the correct parameters", next => {
            const state = {};
            const payload = {};
            const meta = {};
            const r = new Reducer("foo", {});

            r.handleAction("FOO", (s, p, m) => {
                assert.equal(state, s);
                assert.equal(payload, p);
                assert.equal(meta, m);
                next();
            });

            r.reduce(state, { type: "FOO", payload, meta });
        });

        it("should correctly handle errors", next => {
            const payload = new Error();
            const r = new Reducer("foo", {});

            r.handleAction("FOO", () => next(new Error("Calling action instead of error handler.")));
            r.handleError("FOO", () => next());

            r.reduce(undefined, { type: "FOO", payload, error: true });
        });
    });
});