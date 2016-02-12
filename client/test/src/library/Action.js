import Action from "../../../src/library/Action";
import assert from "assert";

const EXAMPLE_ACTION = "FOO";

describe("Action", () => {
    describe("constructor", () => {
        it("should create a new action with the correct properties", () => {
            const a = new Action(EXAMPLE_ACTION);
            assert.equal(a.type, EXAMPLE_ACTION);
        });
    });

    describe("#creator", () => {
        const a = new Action(EXAMPLE_ACTION);
        const creator = a.creator();

        it("should return a valid FSA action object with empty payload", () => {
            assert.deepEqual({
                type: EXAMPLE_ACTION,
                meta: {},
                payload: undefined
            }, creator());
        });

        it("should correctly set the payload", () => {
            assert.deepEqual({
                type: EXAMPLE_ACTION,
                payload: "foo",
                meta: {}
            }, creator("foo"));
        });

        it("should used passed action transformer", () => {
            const b = new Action(EXAMPLE_ACTION, {
                transformer: () => "a"
            });

            assert.deepEqual({
                type: EXAMPLE_ACTION,
                payload: "a",
                meta: {}
            }, b.creator()());
        });
    });

    describe("generator", () => {
        it("should execute a generator", () => {
            const a = new Action(EXAMPLE_ACTION, {
                transformer: function*(b) {
                    const a = yield new Promise(resolve => setTimeout(() => resolve(100), 15));
                    assert.equal(b, 10)
                    assert.equal(a, 100);
                }
            });

            const creator = a.creator();
            return creator(10).payload;
        });
    });
});