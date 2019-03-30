const val = require('../');

var c = val.getStructureChecker(`{key1(string)}`);

var t={key1:"as"};

c(t);
