const Checker = require("./Checker");
var lastEvent;

function handle (req, res, prev) {
    Checker.checkData(this.$eventName, this.$argsList, prev);
    return prev;
}

function checkout(){
    var curEvent = this.$eventName;
    var checkResult = curEvent!=lastEvent;
    lastEvent = curEvent;
    return checkResult;
}

function onCreate() {
    Checker.registerChecker(this.$eventName, this.$executer);
}

module.exports = {
    handle,
    checkout,
    onCreate,
}