const parser = require('../src/conditionParser.js');

function f(v1, v2, v3, v4) {
    // @param v1 { type: string, length : 20 }
    // @ignore name.key1
    // @ignore name.name
    // @ignore name.password
    // @ignore info{_score, _init_date}
    // @accept sort[keyword, date]

    /**
     * @accept args {
     *  key1,
     *  key2 {
     *      name,
     *      pass,
     *      category [ school, it, tech ]
     *      }
     * }
     */
}