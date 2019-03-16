const typeFilter = require("hyron/lib/typeFilter");
const throwSyntaxError = require("./SyntaxParserError");

function iterateCheckInside(event, onChecked) {
    return function checkLoop(input, key = [], origin = input) {
        console.log("-> origin : ");
        console.log(origin);
        if (input == null) {
            onChecked(false, key==null?key:[], input, origin);
        }
        if (!(input instanceof Array) && event.name != "checkLoop") {
            onChecked(false, key==null?key:[], input, origin);
        } else {
            for (var i = 0; i < input.length; i++) {
                var val = input[i];
                key.push(i);
                var checkResult = event(val, key, origin);
                if (checkResult != undefined) {
                    onChecked(checkResult, key, val, origin);
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
                eventHolder = iterateCheckInside(eventInside, onChecked);
            } else if (curChar == "]") {
                if (buf == "") break;
                var allowType = buf.split("|");
                var filterEvent = typeFilter(allowType);
                var handler = iterateCheckInside(filterEvent, onChecked);
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