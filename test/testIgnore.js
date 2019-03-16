var validator = require("..");
var chai = require("chai");

describe("test @ignore", () => {
    var should = chai.should();
    var expect = chai.expect;
    it("match single type", () => {
        function testSingleType(arg) {
            /**
             * @ignore arg(string)
             */
            var checker = validator.getValidator("ignore_type_single");
            checker(Array.from(arguments));
            return arg;
        }
        validator.registerValidator(testSingleType, "ignore_type_single");

        expect(() => {
            testSingleType("ignore string");
        }).to.throw()

        expect(() => {
            testSingleType(12);
        }).to.not.throw()
    })

    it("match multi type", () => {
        function testMultiType(arg) {
            /**
             * @ignore arg(string|number)
             */
            var checker = validator.getValidator("ignore_type_multi");
            checker(Array.from(arguments));
            return arg;
        }
        validator.registerValidator(testMultiType, "ignore_type_multi");

        expect(() => {
            testMultiType("ignore string");
        }).to.throw()

        expect(() => {
            testMultiType(23);
        }).to.throw()

        expect(() => {
            testMultiType(true);
        }).to.not.throw()
    })

    it("match array type", () => {
        function testArrayType(arg) {
            /**
             * @ignore arg[[string]]
             */
            var checker = validator.getValidator("ignore_array_single");
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testArrayType, "ignore_array_single");

        expect(
            testArrayType([
                ["ignore string"]
            ])
        ).to.eql([
            [undefined]
        ], "string argument should be removed");


        expect(
            testArrayType([
                [12]
            ])
        ).to.eql([
            [12]
        ], "string argument should be removed");

    })

    it("match array multi type", () => {
        function testArrayMultiType(arg) {
            /**
             * @ignore arg[string|number]
             */
            var checker = validator.getValidator("ignore_array_multi");
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testArrayMultiType, "ignore_array_multi");

        expect(
            testArrayMultiType(["ignore string"])
        ).to.eql([
            undefined
        ], "string argument should be removed");


        expect(
            testArrayMultiType([12])).to.eql([
            undefined
        ], "number argument should be removed");

        expect(
            testArrayMultiType([true])).to.eql([
            true
        ], "boolean argument should be exist");
    })

    it("match object type", () => {
        function testObjectType(arg) {
            /**
             * @ignore arg {
             *      key1
             * }
             */
            var checker = validator.getValidator("ignore_object");
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testObjectType, "ignore_object");

        expect(
            testObjectType({
                key1:"hello"
            })
        ).to.eql({key1:undefined}, "argument should be removed");


        expect(
            testObjectType([true])).to.eql([
            true
        ], "argument at key should be exist");
    })

})