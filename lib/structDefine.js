const getTypeFilter = require("hyron/lib/typeFilter");
var chalk = require('chalk');

function parserStruct(str, onMatch) {
    var index = 0;

    function getCurrentChar() {
        return str.charAt(index++);
    }

    function throwSyntaxError() {
        index--;
        var invalidStruct = chalk.green(str.substr(0, index)) + chalk.red(str.substr(index));
        throw new SyntaxError(chalk.white(`[error] Cannot analyze structure definition : \n${invalidStruct}`));
    }

    function parserTypeInside(key, buf = "") {
        while (index < str.length) {
            var curChar = getCurrentChar();

            if (curChar == "(") {
                buf = "";
            } else if (curChar == ")") {
                var acceptType = buf.split("|");
                var execFilter = getTypeFilter(acceptType);
                return function checkType(input) {
                    var isMatch = execFilter(input[key]);
                    onMatch(isMatch, key, input);
                };
            } else if (/[\w\d$]/.test(curChar)) {
                buf += curChar;
            } else {
                throwSyntaxError();
            }
        }
    }

    function arrayIterable(event, key) {
        return function iterableCheck(input) {
            if (input == null) {
                return onMatch(false, "$", input);
            }

            for (var i = 0; i < input.length; i++) {
                var val = input[i];
                var isMatch = event(val);
                onMatch(isMatch, key +"."+ i, val);
            }
        }
    }

    function parserArrayField(key) {
        var insideEvent = parserArrayInside(key);
        if (insideEvent == null) throwSyntaxError();

        return function iterableCheck(input) {
            var target = input[key];
            if (target == null) {
                return onMatch(false, key, target);
            }

            insideEvent(target);
        }
    }

    function parserArrayInside(key, buf = "") {
        var event;
        while (index < str.length) {
            var curChar = getCurrentChar();

            if (curChar == "[") {
                var arrayEventInside = parserArrayInside(key);
                event = (input)=>{
                    arrayIterable(arrayEventInside, key)(input);
                }
            } else if (curChar == "{") {
                var objectValidateEvent = parserObjectInside();
                event = arrayIterable(objectValidateEvent, key);
            } else if (curChar == "]") {
                // iterable all element in array and check it
                if (buf == "") break;
                var acceptType = buf.split("|");
                var execFilter = getTypeFilter(acceptType);
                return arrayIterable(execFilter, key);
            } else if (/[\w\d$|]/.test(curChar)) {
                buf += curChar;
            } else {
                throwSyntaxError();
            }
        }
        return event;
    }

    function getCheckField(key) {
        return function checkField(input) {
            var val = input[key];
            var isMatch = val !== undefined;
            onMatch(isMatch, key, val);
        };
    }

    function parserObjectInside(buf = "") {
        var validatorHolder = [];

        while (index < str.length) {
            var curChar = getCurrentChar();

            if (curChar == "}") {
                if (buf != "") {
                    validatorHolder.push(getCheckField(buf));
                }
                return validatorHolder;
            } else if (curChar == "(") {
                var insideTypeValidator = parserTypeInside();
                if (insideTypeValidator == null) throwSyntaxError();
                validatorHolder.push(insideTypeValidator);
                buf = "";
            } else if (curChar == "{") {
                var insideObjectValidator = parserObjectInside();
                if (insideObjectValidator == null) throwSyntaxError();
                validatorHolder.push(insideObjectValidator);
                buf = "";
            } else if (curChar == "[") {
                var arrayTest = parserArrayField(buf);
                validatorHolder.push(arrayTest);
                buf = "";
            } else if (curChar == ",") {
                if (buf == "") continue;
                validatorHolder.push(getCheckField(buf));
                buf = "";
            } else if (/[\w\d$]/.test(curChar)) {
                buf += curChar;
            } else {
                throwSyntaxError();
            }
        }
        return validatorHolder[0];
    }


    str = str.replace(/\s+/g, ""); // compress structure
    var firstChar = str.charAt(0);

    if (firstChar == "{") {
        return parserObjectInside();
    } else if (firstChar == "[") {
        return parserArrayInside();
    } else throwSyntaxError();

}


function getValidator(struct, onMatch) {
    validator = parserStruct(struct, onMatch);

    if (validator == null) return;
    return function (inputObject) {
        validator.forEach((checker) => {
            console.log(checker);
            checker(inputObject);
        })
    }
}

var teststr = `
    {
        key1,
        arr1[[string]]
    }
`;

var test = getValidator(teststr, (isMatch, key, val) => {
    console.log(`
    isMatch : ${isMatch}
    key : ${key}
    val : ${JSON.stringify(val)}

    `)
});

test({
    key1: null,
    arr1: [
        [
            "hello",
            12
        ]
    ]
})



module.exports = parserStruct;