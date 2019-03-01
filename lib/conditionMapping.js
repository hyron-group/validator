const AsyncFunction = (async () => {}).constructor;
const HTTPMessage = require("hyron/lib/HttpMessage");
const StatusCode = require("hyron/lib/StatusCode");

var CONDITION_HANDLE = {
    size: (condition, type) => {
        var allowSize = condition;
        var SIZE_REG = /([\d.]+)(B|KB|MB|GB)?/gi;
        var match = SIZE_REG.exec(allowSize);
        var size = match[1];
        var unit = match[2];
        if (unit != null) {
            unit = unit.toUpperCase();
            if (unit == "KB") size *= 1000;
            else if (unit == "MB") size *= 1000000;
            else if (unit == "GB") size *= 1000000000;
        }
        if (type == "Buffer") return ` && (input !=null) && (Buffer.byteLength(input) < ${size})`;
        if (type == "ClientFile") {
            return ` && (input !=null) && (Buffer.byteLength(input.content) < ${size})`;
        } else return ` && (input.length < ${size})`;
    },
    length_from: (condition, type) => {
        if (type == "string" || type == "Array") {
            return ` && (input.length>${condition})`
        }
    },
    length_to: (condition) => {
        if (type == "string" || type == "Array") {
            return ` && (input.length<=${condition})`
        }
    },
    type: (condition) => {
        var output = "";
        if (["string", "boolean", "number", "object", undefined].includes(condition)) {
            output += ` && (typeof input == '${condition}')`
        } else if (["Array", "Promise", "Buffer", "AsyncFunction"].includes(condition)) {
            output += ` && (input instanceof ${condition})`
        } else {
            output += ` && (input !=null) && (input.constructor.name == '${condition}')`
        }
        return output;
    },
    mime: (condition, type) => {
        //TODO: support for mime type

        if (type == "ClientFile")
            return ` && (input.type == ${condition})`;
        else return "";
    },
    lt: (condition) => {
        return ` && (input < ${condition})`;
    },
    lte: (condition) => {
        return ` && (input <= ${condition})`;
    },
    gt: (condition) => {
        return ` && (input > ${condition})`;
    },
    gte: (condition) => {
        return ` && (input >= ${condition})`;
    },
    eq: (condition) => {
        return ` && (input == ${condition})`;
    },
    ne: (condition) => {
        return ` && (input != ${condition})`;
    },
    in: (condition) => {
        return ` && (${JSON.stringify(condition)}.includes(input))`;
    },
    nin: (condition) => {
        return ` && (!${JSON.stringify(condition)}.includes(input))`;
    },
    reg: (condition, type) => {
        return ` && (${JSON.stringify(condition)}.test(input))`;
    },
    nullable: (condition, type) => {
        if (!condition) return ` & (input != null)`;
        else return "";
    }
};

function getPrettyCondition(condition){
    var prettyCondition = JSON.stringify(condition, null, 1);
    prettyCondition = prettyCondition.replace("{", " ");
    prettyCondition = prettyCondition.replace("}", " ");
    prettyCondition = prettyCondition.replace(/\"/g, "");
    prettyCondition = prettyCondition.replace(":", " : ");
    // prettyCondition = prettyCondition.replace("\n", "<br>");
    // prettyCondition = prettyCondition.replace(",", "<br>");

    return prettyCondition;
}

function getChecker(argsName, conditionMap) {
    if (conditionMap == null) return;
    var buf = "";
    var type = conditionMap.type;
    Object.keys(conditionMap).forEach((key) => {
        var condition = conditionMap[key];
        var mappingHandle = CONDITION_HANDLE[key];
        if (mappingHandle != null) buf += mappingHandle(condition, type);
    });

    buf = buf.substr(4);

    var rawConditionExec = buf;

    var prettyCondition = getPrettyCondition(conditionMap);

    var checkerRaw = `function checker(input){
        var isMatch = ${rawConditionExec};
        if(!isMatch){
            throw new HTTPMessage(
                StatusCode.NOT_ACCEPTABLE,
                \`Invalid param '${argsName}', check if param satisfying conditions ${prettyCondition}\`
            );
        };
        return isMatch;
    }; checker;`

    return eval(checkerRaw);
}

module.exports = getChecker;