const commentParser = require("../lib/commentParser.js");
const structParser = require("../lib/structDefine");
const HTTPMessage = require("hyron/lib/HttpMessage");
const StatusCode = require("hyron/lib/StatusCode");
const argumentParser = require("hyron/plugins/param-parser/lib/argumentParser");
const conditionMapping = require("../lib/conditionMapping");
const stringToObject = require("hyron/lib/objectParser");
const objectEditor = require("hyron/lib/objectEditor");

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
            // console.log("isMatch : " + isMatch);
            // console.log("key : " + key);
            // console.log("val : " + val);
            // console.log("origin : ");
            // console.log(origin)
            // console.log();

            if (isMatch) {
                if (typeof origin == 'object') {
                    objectEditor.replaceValue(key, origin, undefined);
                } else {
                    throw new HTTPMessage(StatusCode.NOT_ACCEPTABLE,
                        `argument '${key}' is prohibited at variable '${val}'`);
                }
            }
        }
    } else if (tag == "accept") {
        onChecked = (isMatch, key, val, origin) => {
            // console.log("isMatch : " + isMatch);
            // console.log("key : " + key);
            // console.log("val : " + val);
            // console.log("origin : ");
            // console.log(origin)
            // console.log();

            if (!isMatch) {
                if (typeof origin == 'object') {
                    objectEditor.replaceValue(key, origin, undefined);
                } else {
                    console.log("tttrrr")
                    throw new HTTPMessage(StatusCode.NOT_ACCEPTABLE,
                        `argument '${key}' is prohibited at variable '${val}'`);
                }
            }
        }
    } else if (tag == "valid") {
        onChecked = (isMatch, key, val, origin) => {
            console.log("isMatch : " + isMatch);
            console.log("key : " + key);
            console.log("val : ");
            console.log(val)
            console.log("origin : ");
            console.log(origin)
            console.log();
            
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
    // console.log(comment);
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
    if (checkerEvents == null) return;

    validator = (argsList) => {
        checkerEvents.forEach((checker) => {
            checker(argsList);
        })
    }

    validatorHolder[eventName] = validator;

    return validator;
}

module.exports = {
    getConditionChecker : conditionMapping,
    getStructChecker : structParser,
    registerValidator,
    getValidator
}