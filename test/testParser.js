var validator = require("../");

function test(var1, var2, var3, var4, var5){
    /**
     * @check var1 {type:string, size: 10}
     * 
     * @ignore var2(string)
     * @ignore var2{
     *      key1,
     *      key2(number)
     * }
     * 
     * @accept var3[string|number]
     * 
     * @accept var4 {
     *      key1(string),
     *      key2{
     *          child1(number),
     *          child2(string)
     *      }
     * }
     * 
     * @valid var5(number)
     * 
     */

     validator.getValidator(test.name)(Array.from(arguments))
}

validator.registerValidator(test);

