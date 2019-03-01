const parserType = require("./parserTypeStruct");
const parserArray = require("./parserArrayStruct");
const parserObject = require("./parserObjectStruct");

function parserStruct(str, key, onChecked) {
    var firstChar = str.charAt(0);

    if(firstChar=="(") return parserType(key, str, onChecked);
    if(firstChar=="[") return parserArray(key, str, onChecked);
    if(firstChar=="{") return parserObject(key, str, onChecked);
}


module.exports = parserStruct;