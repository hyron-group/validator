const prettyConditionStorage = {};

function getPrettyCondition(refKey) {
    var prettyCondition = prettyConditionStorage[refKey];
    return prettyCondition;
}

function registerPrettyError(eventName, condition){
    var prettyCondition = JSON.stringify(condition, null, 1);
    prettyCondition = prettyCondition.replace("{", " ");
    prettyCondition = prettyCondition.replace("}", " ");
    prettyCondition = prettyCondition.replace(/\"/g, "");
    prettyCondition = prettyCondition.replace(":", " : ");
    prettyCondition = prettyCondition.replace("\n", "<br>");
    prettyCondition = prettyCondition.replace(",", "<br>");
    prettyConditionStorage[eventName] = prettyCondition;

}

function InvalidTypeError(paramName, eventName) {
    var prettyCondition = getPrettyCondition(eventName);

    return new HTTPMessage(
        StatusCode.NOT_ACCEPTABLE,
        `Invalid param '${paramName}', check if param satisfying conditions ${prettyCondition}`
    );
}

module.exports = {
    registerPrettyError,
    InvalidTypeError
};