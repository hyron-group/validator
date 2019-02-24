var chalk = require('chalk');

function parserStruct(str, onMatch) {
    var index = 0;

    function getCurrentChar() {
        return str.charAt(index++);
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
    console.log(str);

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
        arr1[[[string]]]
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
            [
                "hello",
                12
            ],
            [
                "world",
                "thang"
            ]
        ]
    ]
})



module.exports = parserStruct;