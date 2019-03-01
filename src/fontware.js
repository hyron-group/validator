const Validator = require("./Validator");

function handle (req, res, prev) {
    var validator = Validator.getValidator(this.$eventName);
    if(validator==null) return prev;

    validator(prev);
    return prev;
}

function checkout(){
    return false;
}

function onCreate() {
    Validator.registerValidator(this.$executer, this.$eventName);
}

module.exports = {
    handle,
    checkout,
    onCreate,
}