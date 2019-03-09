const parserArrayStruct = require("./parserArrayStruct");
const parserTypeStruct = require("./parserTypeStruct");
const throwSyntaxError = require("./SyntaxParserError");

function getCheckField(key, onChecked, checker) {
    // console.log('getCheckField on key : ' + key)

    if (checker == null) {
        return function checkField(input) {
            // console.log("> start check exist field : " + key);
            // console.log(input)
            if (input == null) {
                return onChecked(false, key, input, input);
            }
            var val = input[key];
            var isMatch = val !== undefined;
            onChecked(isMatch, key, val, input);
        };
    } else {
        return function checkField(input) {
            // console.log("> start check field value");
            var val = input[key];

            if (input == null) {
                return onChecked(false, key, val, input);
            }
            checker(val);
        };
    }
}

function iterateCheck(key, checkers, onChecked) {
    if (key == "") {
        return function iterateInside(input) {
            // console.log("> start check iterable object inside");
            if (input == null) {
                onChecked(false, key, input, input);
            }
            for (var i = 0; i < checkers.length; i++) {
                var fieldChecker = checkers[i];
                // console.log(fieldChecker)
                fieldChecker(input);
            }
        }
    } else {
        return function iterateInside(input) {
            // console.log("> start check iterable object inside on key : " + key);
            // console.log(input)
            if (typeof input != "object" || input == null) {
                return onChecked(false, key, input, input);
            }
            if (input == null) {
                onChecked(false, key, input, input);
            }
            for (var i = 0; i < checkers.length; i++) {
                var fieldChecker = checkers[i];
                fieldChecker(input);
            }
        }
    }
}

function parserStruct(key = "", str, onChecked, index = 0) {

    function parserObjectInside(buf = "") {
        var validatorHolder = [];

        while (index < str.length) {
            var curChar = str.charAt(index++);

            if (curChar == "}") {
                if (buf != "") {
                    validatorHolder.push(
                        getCheckField(
                            buf,
                            onChecked));
                }

                return validatorHolder;
            } else if (curChar == "(") {
                // console.log("start parser type");
                var typeTest = parserTypeStruct(buf, str, onChecked, index - 1);
                // console.log("parser type complete !");
                if (typeTest == null) throwSyntaxError(str, index);
                index = typeTest.index + 1;

                validatorHolder.push(getCheckField(buf, onChecked, typeTest.handler));
                // console.log("added to validator");
                buf = "";
            } else if (curChar == "{") {
                // console.log("start parser object");
                var objValidator = parserObjectInside();
                // console.log("parser object success !");
                if (objValidator == null) throwSyntaxError(str, index);
                // console.log(objValidator);
                var fieldLoop = iterateCheck(buf, objValidator, onChecked);
                // console.log("wrapped iterable check");
                var objectTest = getCheckField(buf, onChecked, fieldLoop);
                // console.log("wrapped check field outside");
                if (buf == "") {
                    validatorHolder.push(fieldLoop);
                    // console.log("pushed object check");
                } else {
                    validatorHolder.push(objectTest);
                    // console.log("pushed object check on key : " + buf);
                }
                buf = "";
            } else if (curChar == "[") {
                var arrayTest = parserArrayStruct(buf, str, onChecked, index - 1);
                validatorHolder.push(getCheckField(buf, onChecked, arrayTest.handler));
                index = arrayTest.index + 1;
                buf = "";
            } else if (curChar == ",") {
                if (buf == "") continue;
                validatorHolder.push(getCheckField(buf, onChecked));
                buf = "";
            } else if (/[\w\d$]/.test(curChar)) {
                buf += curChar;
            } else {
                throwSyntaxError(str, index - 1);
            }
        }

        return iterateCheck(key || "", validatorHolder, onChecked);
    }

    var handler = parserObjectInside();
    return {
        handler,
        index
    };
}

// var teststr = "n1{a1,a2}";

// var checker = parserStruct(null, teststr, (onChecked, key, val) => {
//     console.log("onChecked : " + onChecked);
//     console.log("key : " + key);
//     console.log("val : " + val);
//     console.log();
// });

// var test = checker({n1:{
//     a1: "hihi",
//     a2: ["as", 312],

// }})

module.exports = parserStruct;