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
            var checker = validator.getValidator(testArrayMultiType.name);
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testArrayMultiType);

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
             *      key1,
             *      key2
             * }
             */
            var checker = validator.getValidator(testObjectType.name);
            checker(Array.from(arguments));
            return arg;
        }

        validator.registerValidator(testObjectType);

        expect(
            testObjectType({
                key1:"hello",
                key2:"world"
            })
        ).to.eql({}, "string argument should be removed");


        expect(
            testObjectType([12])).to.eql([
            undefined
        ], "number argument should be removed");

        expect(
            testObjectType([true])).to.eql([
            true
        ], "boolean argument should be exist");
    })

})