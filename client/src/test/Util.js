import assert from "assert";
import { Enum } from "../Util";

describe("Util", () => {
    describe("Enum", () => {
        it("should correctly create the enum object", () => {
            var num = Enum("BEARS", "BEATS");

            assert.equal(num.BEARS, "BEARS");
            assert.equal(num.BEATS, "BEATS");

            // Ensure we can't modify the enum
            assert.throws(() => { num.BEATS = "BATTLESTAR GALACTICA"; });
        });
    });
});