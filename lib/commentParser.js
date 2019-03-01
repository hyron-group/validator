function parserComment(rawFunc) {
    var str = rawFunc;
    var cmtHolder = [];
    const COND_REG = /(\/\/)?\s*@([\w\d]+)\s+([\w\d$]+)\s*([\w\d\s\(\)\{\}\[\]:*,\"\'$]*)/g;

    var match;
    while ((match = COND_REG.exec(str))) {
        var isSingleLineCmt = match[1] != null;
        if (isSingleLineCmt) continue;

        var tag = match[2];
        var key = match[3];
        var condition = match[4];
        condition = condition.replace(/\n\s*\*/g, "");
        condition = condition.replace(/\s*/g, "");

        // console.log("tag : " + tag);
        // console.log("key : " + key);
        // console.log("cond : " + condition);
        // console.log()
        cmtHolder.push({
            tag,
            key,
            condition
        })
    }

    return cmtHolder;
}

module.exports = parserComment;