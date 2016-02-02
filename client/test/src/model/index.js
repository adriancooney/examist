import Model from "../../../src/model";
import assert from "assert";

describe("Model", () => {
    describe("root reducer", () => {
        it("should be a reducer", () => {
            assert.equal(typeof Model, "function");

            const state = Model(undefined, { type: "UNDEFINED_ACTION" });
            assert(typeof state === "object");
            console.log("Initial State: ", state);
        });
    });
});