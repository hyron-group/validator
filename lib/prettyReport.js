const prettyConditionStorage = {};

function getPrettyCondition(refKey) {
    var prettyCondition = prettyConditionStorage[refKey];
    return prettyCondition;
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