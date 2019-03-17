const typeFilter = require("hyron/lib/typeFilter");
const throwSyntaxError = require("./SyntaxParserError");

function iterateCheckInside(event, onChecked) {
    return function checkLoop(input, key = [], origin = input) {
        if (input == null) {
            onChecked(false, key, input, origin);
        }
        if (!(input instanceof Array) && event.name != "checkLoop") {
            onChecked(false, key, input, origin);
        } else {
            var index = key.length;
            // console.log(input);

            for (var i = 0; i < input.length; i++) {
                var val = input[i];
                var curKey = key.slice(0);
                curKey[index] = i;
                // console.log("-> key : " + JSON.stringify(curKey));
                // console.log("-> val : " + JSON.stringify(val));
                // console.log("-> input : " + JSON.stringify(input));

                var checkResult = event(val, curKey, origin);
                if (checkResult != undefined) {
                    onChecked(checkResult, curKey, val, origin);
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

// var teststr = `[[string]]`;

// var checker = parserStruct(null, teststr, (isMatch, key, val, origin) => {
//     console.log("isMatch : " + isMatch);
//     console.log("key : " + key);
//     console.log("val : "+val);
//     console.log();
// });

// checker.handler([
//     ["hello", "world", "thang"],
//     [12, 43, 54]
// ])

module.exports = parserStruct;