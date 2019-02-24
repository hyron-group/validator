const getTypeFilter = require("hyron/lib/typeFilter");
const throwSyntaxError = require("./SyntaxParserError");

function parserStruct(key, str, onChecked, index = 0) {
    var buf = "";
    while (index++ < str.length) {
        var curChar = str.charAt(index);

        if (curChar == "(") {
            buf = "";
        } else if (curChar == ")") {
            var acceptType = buf.split("|");
            var execFilter = getTypeFilter(acceptType);
            var checker;
            if (key == null) {
                checker = function (input) {
                    var isMatch = execFilter(input);
                    onChecked(isMatch, undefined, input);
                }
            } else {
                checker = function (input) {
                    var isMatch = execFilter(input[key]);
                    onChecked(isMatch, key, input);
                };
            }
            return checker;
        } else if (/[\w\d$]/.test(curChar)) {
            buf += curChar;
        } else {
            throwSyntaxError();
        }
    }

}

parserStruct(null, "(adfaf")

module.exports = parserStruct;