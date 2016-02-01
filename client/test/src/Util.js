import assert from "assert";
import { Enum, types, validate } from "../../src/Util";

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

    describe("types", () => {
        const isError = (error, pattern = /.*/) => error instanceof Error && pattern.test(error.message);

        it("should validate primitive types", () => {
            assert.equal(types.string("foo"), null);
            assert.equal(types.number(1), null);
            assert.equal(types.array([]), null);
            assert.equal(types.func(() => {}), null);
            assert.equal(types.bool(true), null);
            assert.equal(types.object({}), null);

            // Trick questions 
            assert.equal(types.bool(false), null, "bool trick");
            assert.equal(types.number(0), null, "number trick");
            assert(isError(types.object([]), /expected/), "not object []");
            assert(isError(types.array({}), /expected/), "not array {}");
        });

        it("should require all types to be passed a value", () => {
            assert(isError(types.string(), /not found/));
            assert(isError(types.string(""), /not found/));
            assert(isError(types.number(), /not found/));
            assert(isError(types.array(), /not found/));
            assert(isError(types.func(), /not found/));
            assert(isError(types.bool(), /not found/));
            assert(isError(types.object(), /not found/));
        });

        it("should validate optional primitive types", () => {
            assert.equal(types.string.optional(""), null);
            assert.equal(types.string.optional("foo"), null);
            assert(types.string.optional(124) instanceof TypeError);
            assert.equal(types.bool.optional(false), null);
            assert.equal(types.bool.optional(), null);
        });

        describe("shape", () => {
            it("should return a type checking function", () => {
                assert(typeof types.shape({}) === "function");
            });

            it("should throw an error if I don't pass a type", () => {
                assert.throws(types.shape.bind(null, { foo: "bar" }));
            });

            it("should correctly check the shape", () => {
                const shape = types.shape({
                    foo: types.string
                });

                assert.equal(shape({
                    foo: "bar"
                }), null);

                assert(isError(shape({
                    foo: 0
                })), /foo/);
            });

            it("should correctly nest", () => {
                const shape = types.shape({
                    foo: types.shape({
                        bar: types.string
                    })
                });

                assert.equal(shape({
                    foo: {
                        bar: "foo"
                    }
                }), null);
            });

            it("should work optionally", () => {
                const shape = types.shape.optional({
                    foo: types.string
                });

                assert.equal(shape(), null);
            });

            it("should pass the correct references, expected and actual in error", () => {
                const details = types.shape({
                    username: types.string,
                    password: types.string
                });

                let typeError = details({ username: "" });

                assert.equal(typeError.ref, "username");
            });
        });
    });

    describe("validate", () => {
        it("should validate an object of data given types", () => {
            return validate(types.string, "foo");
        });

        it("should not validate an object of invalid data given types", done => {
            return validate(types.string, 1).catch(err => done());
        });

        it("should assume type as string object when only passing data", () => {
            return validate({
                "foo": "bar"
            });
        });

        it("should allow for passing an object as an implicit shape type", () => {
            return validate({
                "foo": types.string,
                "bar": types.number
            }, {
                "foo": "bar",
                "bar": 10
            });
        });

        it("should assume type as string object when only passing data and fail on incorrect data", done => {
            return validate({
                "foo": ""
            }).catch(err => done());
        });
    });
});