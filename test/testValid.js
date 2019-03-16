var validator = require("..");
var chai = require("chai");

describe("test @valid", () => {
    var should = chai.should();
    var expect = chai.expect;
    it("match single type", () => {
        function testSingleType(arg) {
            /**
             * @valid arg(string)
             */
            var checker = validator.getValidator("valid_type_single");
            checker(Array.from(arguments));
            return arg;
        }
        validator.registerValidator(testSingleType, "valid_type_single");

        expect(() => {
            testSingleType("valid string");
        }).to.not.throw()

        expect(() => {
            testSingleType(12);
        }).to.throw()
    })

    it("match multi type", () => {
        function testMultiType(arg) {
            /**
             * @valid arg(string|number)
             */
            var checker = validator.getValidator("valid_type_multi");
            checker(Array.from(arguments));
            return arg;
        }
        validator.registerValidator(testMultiType, "valid_type_multi");

        expect(() => {
            testMultiType("valid string");
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
             * @valid arg[[string]]
             */
            var checker = validator.getValidator("valid_array_single");
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testArrayType, "valid_array_single");

        expect(
            testArrayType([
                ["valid string"]
            ])
        ).to.not.throw();

        expect(
            testArrayType([
                [12]
            ])
        ).to.throw();
    })

    it("match array multi type", () => {
        function testArrayMultiType(arg) {
            /**
             * @valid arg[string|number]
             */
            var checker = validator.getValidator("valid_array_multi");
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testArrayMultiType, "valid_array_multi");

        expect(
            testArrayMultiType(["valid string"])
        ).to.not.throw()


        expect(
            testArrayMultiType([12])).to.not.throw();
        expect(
            testArrayMultiType([true])).to.throw()
    })

    it("match object type", () => {
        function testObjectType(arg) {
            /**
             * @valid arg {
             *      key1
             * }
             */
            var checker = validator.getValidator("valid_object");
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testObjectType, "valid_object");

        expect(
            testObjectType({
                key1: "hello"
            })
        ).to.not.throw();


        expect(
            testObjectType([true])).to.throw();
    })

})