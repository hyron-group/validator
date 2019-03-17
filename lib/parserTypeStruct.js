const getTypeFilter = require("hyron/lib/typeFilter");
const throwSyntaxError = require("./SyntaxParserError");

function parserStruct(key, str, onChecked, index = 0) {
    var buf = "";
    str = str.replace(/[\s]+/g, "");
    if (str.charAt(index) != '(') throwSyntaxError(str, index);


    while (index++ < str.length) {
        var curChar = str.charAt(index);

        if (curChar == "(") {
            buf = "";
        } else if (curChar == ")") {
            var acceptType = buf.split("|");
            var execFilter = getTypeFilter(acceptType);
            var handler;
            if (buf == "") {
                handler = function checkType(input, origin = input) {
                    var isMatch = input != null;
                    onChecked(isMatch, key, input, origin);
                };
            } else {
                handler = function checkType(input, origin = input) {
                    var isMatch = execFilter(input);
                    onChecked(isMatch, key, input, origin);
                };
            }
            return {
                handler,
                index
            };
        } else if (/[\w\d|$]/.test(curChar)) {
            buf += curChar;
        } else {
            throwSyntaxError(str, index);
        }
    }
}

// var teststr = `
// (string|boolean)
// `;

// var checker = parserStruct(null, teststr, (isMatch, key, val, origin) => {
//     console.log("isMatch : " + isMatch);
//     console.log("key : " + key);
//     console.log("val : " + val);
//     console.log();
// }).handler;

// checker(43);

module.exports = parserStruct;