import Resource from "../../../src/library/Resource";
import Reducer from "../../../src/library/Reducer";
import assert from "assert";

describe("Resource", () => {
    describe("constructor", () => {
        let user = new Resource("user", "id");
        const action = (r) => ({ type: "USER", payload: r })

        it("should be a reducer", () => {
            assert(user instanceof Reducer);
        });

        it("should have the proper action handlers attached", () => {
            assert(user.actionHandlers["USER"]);
        });

        it("should reduce a new resource", () => {
            let a = { id: 1, name: "foo" };
            let state = user.reduce(undefined, action(a));
            assert.equal(state[0], a);
        });

        it("should merge a new resource with old", () => {
            let a = { id: 1, name: "foo" };
            let b = { id: 2, name: "bar" };
            let c = { id: 1, name: "baz" };

            let state = user.reduce(
                user.reduce(
                    user.reduce(
                        undefined, 
                        action(a)
                    ),
                    action(b)
                ),
                action(c)
            );

            assert.equal(state[0], c);
            assert.equal(state[1], b);
        });
    });

    describe("#selectByKey", () => {
        const user = new Resource("user", "id");
        const paper = new Resource("paper", "id");

        const root = Reducer.combine(user, paper);
        const state = root.reduce(undefined, { type: "USER", payload: { id: 1, name: "Adrian" }});

        it("should get by Id", () => {
            const selector = user.selectByKey(1);
            assert(typeof selector === "function");

            const value = selector(state);
            assert.equal(value.id, 1);
        });
    });
});