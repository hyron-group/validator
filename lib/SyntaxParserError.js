const chalk = require('chalk');

function throwSyntaxError(str, index) {
    var invalidStruct =
        chalk.green(str.substr(0, index)) +
        chalk.red(str.substr(index));
    throw new SyntaxError(
        chalk.white(
            `[error] Cannot analyze structure definition : \n${invalidStruct}`
            ));
}

module.exports = throwSyntaxError;