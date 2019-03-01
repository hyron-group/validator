const commentParser = require("../lib/commentParser.js");
const structParser = require("../lib/structDefine");
const HTTPMessage = require("hyron/lib/HttpMessage");
const StatusCode = require("hyron/lib/StatusCode");
const argumentParser = require("hyron/plugins/param-parser/lib/argumentParser.js");
const conditionMapping = require("../lib/conditionMapping");
const stringToObject = require("hyron/lib/objectParser");

var validatorHolder = {};

function getArgChecker(index, varName, condition) {
    var conditionMap = stringToObject(condition);
    var checker = conditionMapping(varName, conditionMap);
    var argChecker = function checkValue(args) {
        var value = args[index];
        checker(value);
    }
    return argChecker;
}

function getStructValidator(tag, index, varName, condition) {
    var onChecked;

    if (tag == "ignore") {
        var onChecked = (isMatch, key, val, origin) => {
            if (isMatch) {
                delete origin[key];
            }
        }
    } else if (tag == "accept") {
        onChecked = (isMatch, key, val, origin) => {
            if (!isMatch) {
                delete origin[key];
            }
        }
    } else if (tag == "valid") {
        onChecked = (isMatch, key, val, origin) => {
            if (!isMatch) {
                throw new HTTPMessage(
                    StatusCode.NOT_ACCEPTABLE,
                    `properties '${key}' is prohibited at variable '${varName}' : ${JSON.stringify(val)}`);
            }
        }
    }
    var structValidator = structParser(condition, varName, onChecked).handler;
    return function checkStruct(args) {
        var value = args[index];

        structValidator(value);
    }
}


function getCheckerEvents(func) {
    var rawFunc = func.toString();
    var comment = commentParser(rawFunc);
    var argList = argumentParser(rawFunc);
    var validatorHolder = [];

    comment.forEach(({
        tag,
        key,
        condition
    }) => {
        var indexOfArg = argList.indexOf(key);
        if (indexOfArg == -1) return;
        var argChecker;

        if (["ignore", "accept", "valid"].includes(tag)) {
            argChecker = getStructValidator(tag, indexOfArg, key, condition);
        } else if (tag == "check") {
            argChecker = getArgChecker(indexOfArg, key, condition);
        }

        validatorHolder.push(argChecker);
    })

    return validatorHolder;

}

function getValidator(eventName) {
    return validatorHolder[eventName];
}

function registerValidator(func, eventName = func.name) {
    var validator = getValidator(eventName);
    if (validator != null) return validator;

    var checkerEvents = getCheckerEvents(func);
    console.log(checkerEvents);
    if (checkerEvents == null) return;

    validator = (argsList) => {
        checkerEvents.forEach((checker) => {
            checker(argsList);
        })
    }

    validatorHolder[eventName] = validator;
    console.log(validatorHolder);

    return validator;
}


function test(var1, var2) {
    /**
     * @accept var1 {
     *      k1,k2
     * }
     * 
     * @check var1 {size:10, type:*}
     * 
     */

    /*
    * @accept var1 (string)
    @ignore var2 (number)
    */

    // @check var2 {type:*}
    registerValidator(arguments.callee);
    return "asda"
}

test()

module.exports = {
    registerValidator,
    getValidator
}