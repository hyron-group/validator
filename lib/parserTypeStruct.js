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
            var handler;
            // if(key==null){
                handler = function checkType(input, origin=input) {
                    var isMatch = execFilter(input);
                    onChecked(isMatch, key, input, origin);
                };
            // } else {
            //     handler = function checkType(input) {
            //         console.log("input : "+key)

            //         var val = input[key];
            //         var isMatch = execFilter(val);
            //         onChecked(isMatch, key, val, input);
            //     };
            // }
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

module.exports = parserStruct;