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
            var checker = validator.getValidator(testSingleType.name);
            checker(Array.from(arguments));
            return arg;
        }
        validator.registerValidator(testSingleType);

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
            var checker = validator.getValidator(testMultiType.name);
            checker(Array.from(arguments));
            return arg;
        }
        validator.registerValidator(testMultiType);

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
            var checker = validator.getValidator(testArrayType.name);
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testArrayType);

        should.equal(
            testArrayType([
                ["ignore string"]
            ]), [],
            "string argument should be removed");

        should.equal(
            testArrayType([
                [12]
            ]), [12],
            "number argument should be exist"); 

    })

})