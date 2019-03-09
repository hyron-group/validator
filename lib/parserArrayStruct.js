const typeFilter = require("hyron/lib/typeFilter");
const throwSyntaxError = require("./SyntaxParserError");

function iterateCheckInside(key, event, onChecked) {
    return function checkLoop(input, parentKey = "", parent = input) {
        console.log(parent);

        if (input == null) {
            onChecked(false, key==null?key:key.substr(1), input, parent);
        }
        if (!(input instanceof Array) && event.name != "checkLoop") {
            onChecked(false, key==null?key:key.substr(1), input, parent);
        } else {
            for (var i = 0; i < input.length; i++) {
                var childKey = parentKey + "." + i;
                var val = input[i];
                var checkResult = event(val, childKey, input);
                if (checkResult != undefined) {
                    onChecked(checkResult, childKey.substr(1), val, parent);
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
                var eventInside = parserArrayInside();
                eventHolder = iterateCheckInside(key, eventInside, onChecked);
            } else if (curChar == "]") {
                if (buf == "") break;
                var allowType = buf.split("|");
                var filterEvent = typeFilter(allowType);
                var handler = iterateCheckInside(key, filterEvent, onChecked);
                return handler;
            } else if (/[\w\d$|]/.test(curChar)) {
                buf += curChar;
            } else {
                throwSyntaxError(str, index);
            }
        }
        return eventHolder;
    }

    var handler = parserArrayInside(key);
    return {
        handler,
        index
    }
}

module.exports = parserStruct;