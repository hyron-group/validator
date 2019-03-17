var validator = require("..");
var chai = require("chai");

describe("test @check", () => {
    var should = chai.should();
    var expect = chai.expect;
    it("check size", () => {
        function testSingleType(arg) {
            /**
             * @check arg {size:5}
             */
            var checker = validator.getValidator("check_size");
            checker(Array.from(arguments));
            return arg;
        }
        validator.registerValidator(testSingleType, "check_size");

        expect(() => {
            testSingleType("1234");
        }).to.not.throw()

        expect(() => {
            testSingleType("123456");
        }).to.throw()
    })
})