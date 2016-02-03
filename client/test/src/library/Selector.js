import { collapse } from "../../../src/library/Selector";
import assert from "assert";

describe("Selector", () => {
    describe("collapse", () => {
        it("should correctly collapse selectors", () => {
            let initialState = {};
            let s1 = (state) => initialState;
            let s2 = (state) => { assert.equal(state, initialState); return null; }
            let s3 = (state) => { throw new Error("Called selector after null return."); }

            let result = collapse(s1, s2, s3)();
            assert.equal(result, null);
        });
    });
});