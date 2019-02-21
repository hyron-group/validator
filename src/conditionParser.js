const commentParser = require("../lib/commentParser");
const stringToObject = require("hyron/lib/objectParser");
const conditionMapping = require("../lib/conditionMapping");
const prettyReport = require("../lib/prettyReport");

// format : @check <args_name> { <condition> }
const CONDITION_REG = /@check\s+([\w\d]+)\s*([\w\d\s.:,\u002d\002b%^&'"*\[\]\{\}]*)/g;
const IGNORE_REG = /@ignore\s+([\w\d\s.\{_\}\[\],\'\"]+)/g;
const ACCEPT_REG = /@accept\s+([\w\d\s.\{_\}\[\],\'\"]+)/g;




function parserFilter(rawFunc) {
    while ((match = IGNORE_REG.exec(comment)) != null) {
        var key = match[1];
        var condition = match[2];
        result[key] = condition;
    }

    return result;
}

function parserCheckParam(comment) {
    while ((match = CONDITION_REG.exec(comment)) != null) {
        var key = match[1];
        var condition = stringToObject(match[2]);
        result[key] = condition;
    }

    return result;
}

function getConditionFromComment(rawfunc) {
    var comment = commentParser(rawfunc);
    var result = {};
    var match;
    if (comment != null);
    comment.forEach((curComment) => {
        parserCheckParam(curComment);
    })
    return result;
}

module.exports = getConditionFromComment;