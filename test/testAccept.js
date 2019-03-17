var validator = require("..");
var chai = require("chai");

describe("test @accept", () => {
    var should = chai.should();
    var expect = chai.expect;
    it("match single type", () => {

        function testSingleType(arg) {
            /**
             * @accept arg(string)
             */
            var checker = validator.getValidator("accept_type_single");
            checker(Array.from(arguments));
            return arg;
        }
        validator.registerValidator(testSingleType, "accept_type_single");

        expect(() => {
            testSingleType("accept string");
        }).to.not.throw();

        expect(() => {
            testSingleType(12);
        }).to.throw();
    })

    it("match multi type", () => {
        function testMultiType(arg) {
            /**
             * @accept arg(string|number)
             */
            var checker = validator.getValidator("accept_type_multi");
            checker(Array.from(arguments));
            return arg;
        }
        validator.registerValidator(testMultiType, "accept_type_multi");

        expect(() => {
            testMultiType("accept string");
        }).to.not.throw()

        expect(() => {
            testMultiType(23);
        }).to.not.throw()

        expect(() => {
            testMultiType(true);
        }).to.throw()
    })

    it("match array type", () => {
        function testArrayType(arg) {
            /**
             * @accept arg[string]
             */
            var checker = validator.getValidator("accept_array_single");
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testArrayType, "accept_array_single");

        expect(
            testArrayType(
                ["accept string"]
            )
        ).to.eql(
            ["accept string"], "string argument should be exist"
        );


        expect(
            testArrayType(
                [12]
            )
        ).to.eql(
            [undefined], "number argument should be removed");

    })

    it("match array multi type", () => {
        function testArrayMultiType(arg) {
            /**
             * @accept arg[string|number]
             */
            var checker = validator.getValidator("accept_array_multi");
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testArrayMultiType, "accept_array_multi");

        expect(
            testArrayMultiType(["accept string"])
        ).to.eql([
            "accept string"
        ], "string argument should be exist");


        expect(
            testArrayMultiType([12])).to.eql([
                12
        ], "number argument should be removed");

        expect(
            testArrayMultiType([true])).to.eql([
            undefined
        ], "boolean argument should be exist");
    })

    it("match object type", () => {
        function testObjectType(arg) {
            /**
             * @accept arg {
             *      key1(string)
             * }
             */
            var checker = validator.getValidator("accept_object");
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testObjectType, "accept_object");

        expect(
            testObjectType({
                key1: "hello"
            })
        ).to.eql({
            key1: "hello"
        }, "argument should be exist");

        expect(
            testObjectType({
                key1: 12
            })
        ).to.eql({
            key1: undefined
        }, "argument should be exist");


    })

})