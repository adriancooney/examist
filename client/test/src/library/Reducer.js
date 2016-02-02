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

        it("should create a reducer with a master reducer", () => {
            const g = () => {};
            const r = new Reducer("foo", g);
            assert.equal(g, r.reducer);
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

        it("should return the untouched state if not actions match", () => {
            const r = new Reducer("foo", {});
            const state = { foo: "bar" };
            assert.equal(state, r.reduce(state, { type: "UNKNOWN"}));
        });
    });

    describe("#apply", () => {
        it("should apply the master reducer", next => {
            const a = new Reducer("foo", () => {
                next();
            });

            a.apply("foo", "bar");
        });

        it("should apply the reducer reducer", next => {
            const a = new Reducer("foo", {});
            a.handleAction("foo", () => next());
            a.apply(null, { type: "foo" });
        });
    });

    describe(".combine", () => {
        const a = new Reducer("a", {});
        const b = new Reducer("b", {});
        const c = new Reducer("c", {});
        const root = Reducer.combine(a, b, c);

        it("should combine reducers by name", () => {
            const state = root.apply(undefined, { type: "UNDEFINED_ACTION" });

            assert(state.a);
            assert(state.b);
            assert(state.c);

            assert(a.__parent === root);
        });

        describe("#getState", () => {
            it("should return the root state with getState", () => {
                const state = {};
                const selectedState = root.getState(state);

                assert.equal(state, selectedState);
            });

            it("should scope state child state", () => {
                const eq = { foo: 1 };
                const state = { a: eq };
                const selectedState = a.getState(state);
                assert.equal(eq, selectedState);
            });

            it("should work with named combined reducers", () => {
                const d = new Reducer("d", {});
                const e = new Reducer("e", {});
                const f = Reducer.combine("f", d, e);
                const g = Reducer.combine(a, f);

                const state = { "a": 1, "f": { "d": { foo: 1 }, "e": { "bar": 1 } } };

                assert.equal(d.getState(state).foo, 1);
            });
        });
    });

    describe("#resetAction", () => {
        it("should reset the reducer if the reset action is sent", () => {
            const initialState = {};
            const a = new Reducer("a", initialState);
            a.resetAction("FOO");
            assert.equal(initialState, a.reduce({ foo: "bar" }, { type: "FOO" }));
        });

        it("should reset a cominbed reducer if the reset action is sent", () => {
            const initialState = { a: {}, b: {} };
            const a = new Reducer("a", {});
            const b = new Reducer("b", {});
            const root = Reducer.combine(a, b);
            root.resetAction("FOO");
            assert.deepEqual(root.apply({ "foo": "bar"}, { type: "FOO" }), initialState);
        });
    });
});