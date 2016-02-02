import Model from "../../../src/model";
import assert from "assert";

describe("Model", () => {
    const rootReducer = Model.getReducer();

    describe("root reducer", () => {
        it("should be a reducer", () => {
            assert.equal(typeof rootReducer, "function");

            const state = rootReducer(undefined, { type: "UNDEFINED_ACTION" });
            assert(typeof state === "object");
            console.log("Initial State: ", state);
        });
    });
});