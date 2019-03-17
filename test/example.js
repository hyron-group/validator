const Validator = require('../src/Validator'); // as require("@hyron/validator")

function testCheck(file){
    /**
     * @check file{size:2MB}
     */
    var checker = Validator.getValidator(testCheck.name);
    checker(Array.from(arguments));
    return file;
}

function testValid(name, age) {
    /**
     * @valid name(string)
     * @valid age(number)
     */
    var checker = Validator.getValidator(testValid.name);
    checker(Array.from(arguments));
    return name + " : " + age;
}

function testIgnore(members) {
    /**
     * @ignore members[number]
     */
    var checker = Validator.getValidator(testIgnore.name);
    checker(Array.from(arguments));
    return members;
}

function testAccept(filter) {
    /**
     * @valid filter{
     *      cost,
     *      time
     * }
     */
    var checker = Validator.getValidator(testAccept.name);
    checker(Array.from(arguments));
    return filter;
}

Validator.registerValidator(testValid);
Validator.registerValidator(testIgnore);
Validator.registerValidator(testAccept);
Validator.registerValidator(testCheck);

// console.log(testValid("thang", 12)) 
// console.log(testIgnore([32,54]))
console.log(testAccept({cost:43, user:"thang", time:12}))

