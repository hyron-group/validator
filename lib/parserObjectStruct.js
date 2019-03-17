const parserArrayStruct = require("./parserArrayStruct");
const parserTypeStruct = require("./parserTypeStruct");
const throwSyntaxError = require("./SyntaxParserError");

function getCheckField(key, onChecked, checker) {
    if (checker == null) {
        return function checkExist(input, origin = input) {
            var isMatch = input !== undefined;
            onChecked(isMatch, key, input, origin);
        };
    } else {
        return function checkField(input, origin = input) {
            if (input == null) {
                return onChecked(false, key, input, origin);
            }
            checker(input, origin);
        };
    }
}

function checkObject(key, checkersHolder, onChecked) {
    return function iterateInside(input, origin = input) {
        if (input == null || input.constructor.name != "Object") {
            return onChecked(false, key, input, origin);
        }
        for (var objectField in input) {
            var val = input[objectField];
            var checker = checkersHolder[objectField];
            if (checker == null) {
                onChecked(false, objectField, val, origin);
            } else {
                checker(val, origin);
            }
        }
    }
}

function parserStruct(key = "", str, onChecked, index = 0) {
    str = str.replace(/[\n]+/, "");
    if (str.charAt(index) != "{") throwSyntaxError(str, index);

    function parserObjectInside(buf = "") {
        var validatorHolder = {};

        while (index < str.length) {
            var curChar = str.charAt(index++);

            if (curChar == "}") {
                if (buf != "") {
                    validatorHolder[buf] = getCheckField(
                        buf,
                        onChecked);
                }
                // console.log(validatorHolder);
                return validatorHolder;
            } else if (curChar == "(") {
                var typeTest = parserTypeStruct(buf, str, onChecked, index - 1);
                if (typeTest == null) throwSyntaxError(str, index);
                index = typeTest.index + 1;

                validatorHolder[buf] = getCheckField(buf, onChecked, typeTest.handler);
                // console.log("added to validator");
                buf = "";
            } else if (curChar == "{") {
                var objValidator = parserObjectInside();
                if (objValidator == null||objValidator.constructor.name!="Object") throwSyntaxError(str, index);
                var fieldLoop = checkObject(buf, objValidator, onChecked);
                var objectTest = getCheckField(buf, onChecked, fieldLoop);
                if (buf == "") {
                    validatorHolder = objValidator;
                } else {
                    validatorHolder[buf] = objectTest;
                }
                buf = "";
            } else if (curChar == "[") {
                var arrayTest = parserArrayStruct(buf, str, onChecked, index - 1);
                validatorHolder[buf] = getCheckField(buf, onChecked, arrayTest.handler);
                index = arrayTest.index + 1;
                buf = "";
            } else if (curChar == ",") {
                if (buf == "") continue;
                validatorHolder[buf] = getCheckField(buf, onChecked);
                buf = "";
            } else if (/[\w\d$]/.test(curChar)) {
                buf += curChar;
            } else {
                throwSyntaxError(str, index - 1);
            }
        }

        return checkObject(key, validatorHolder, onChecked);
    }

    var handler = parserObjectInside();
    return {
        handler,
        index
    };
}

var teststr = `{a1,a2,a3}`;

var checker = parserStruct(null, teststr, (onChecked, key, val, origin) => {
    console.log("isMatch : " + onChecked);
    console.log("key : " + JSON.stringify(key));
    console.log("val : " + JSON.stringify(val));
    console.log("origin : " + JSON.stringify(origin));

    console.log();
}).handler;

var test = checker({
    a1: "hihi",
    a2: ["as", 312],
    a3: {
        k1: "thang"
    }
})

module.exports = parserStruct;