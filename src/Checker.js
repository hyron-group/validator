const conditionParser = require("./conditionParser");
const prettyReport = require("../lib/prettyReport");
const conditionMapping = require("../lib/conditionMapping");
const conditionStorage = {};

var checkerStorage = {};

function registerChecker(eventName, func) {
    var checker = checkerStorage[eventName];
    if (checker == null) {
        checker = getCheckerExecList(eventName, func.toString());
        checkerStorage[eventName] = checker;
    }
}

function getParamEventName(eventName, arg) {
    return eventName + "::" + arg;
}

function checkData(eventName, argsList, argsData) {
    if (argsData == null) return;
    var checkerExecList = checkerStorage[eventName];
    if (checkerExecList == null) return;
    for (var argName in checkerExecList) {
        var indexOfArg = argsList[argName];
        var data = argsData[indexOfArg];

        if (!testVal(eventName, argName, data)) {
            throw InvalidTypeError(argName, eventName);
        }
    }
}

function testVal(eventName, argName, value) {
    var paramsEventName = getParamEventName(eventName, argName);
    var checkerExec = checkerExecList[paramsEventName];
    if (checkerExec == null) return true;
    var testResult = checkerExec(value);
    return testResult;
}

function getCheckerExecList(eventName, raw) {
    var execList = {};
    var inputCondition = conditionParser(raw);
    Object.keys(inputCondition).forEach((argName) => {
        var curCondition = inputCondition[argName];
        prettyReport.registerPrettyError(eventName, curCondition);
        var conditionExecute = conditionMapping(curCondition);
        var paramsEventName = getParamEventName(eventName, argName);
        conditionStorage[paramsEventName] = conditionExecute;
        var finalExec = eval(`(input)=>{return ${conditionExecute}}`);
        execList[argName] = finalExec;
    });
    return execList;
}

module.exports = {
    checkData,
    registerChecker
};