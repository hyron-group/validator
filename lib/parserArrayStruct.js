const typeFilter = require("hyron/lib/typeFilter");
const throwSyntaxError = require("./SyntaxParserError");

function iterateCheckInside(key, event, onChecked) {
    return function checkLoop(input, parentKey = key) {

        if (input == null) {
            onChecked(false, key);
        }
        if (!(input instanceof Array) && event.name != "checkLoop") {
            onChecked(false, key, input);
        } else {
            for (var i = 0; i < input.length; i++) {
                var childKey = parentKey + "." + i;
                var val = input[i];
                var checkResult = event(val, childKey);
                if (checkResult != undefined) {
                    onChecked(checkResult, childKey, val);
                }
            }
        }
    }
}

function parserStruct(key, str, onChecked, index = 0) {
    function parserArrayInside(key, buf = "") {
        var eventHolder;
        while (index++ < str.length) {
            var curChar = str.charAt(index);

            if (curChar == "[") {
                var eventInside = parserArrayInside(key + ".#");
                eventHolder = iterateCheckInside(key, eventInside, onChecked);
            } else if (curChar == "]") {
                if (buf == "") break;
                var allowType = buf.split("|");
                var filterEvent = typeFilter(allowType);
                return iterateCheckInside(key, filterEvent, onChecked);
            } else if (/[\w\d$|]/.test(curChar)) {
                buf += curChar;
            } else {
                throwSyntaxError(str, index);
            }
        }
        return eventHolder;
    }

    return parserArrayInside(key);
}

module.exports = parserStruct;