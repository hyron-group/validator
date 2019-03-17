const hyron = require("hyron");

class Demo {
    static requestConfig() {
        return {
            $all: {
                plugins: ["validator"]
            },
            testCheck: "post",
            testValid: "get",
            testIgnore: "post",
            testAccept: "post"
        }
    }

    testCheck(file) {
        /**
         * @check file{size:2MB}
         */
        return file;
    }

    testValid(name, age) {
        /**
         * @valid name(string)
         * @valid age(number)
         */

        return name + " : " + age;
    }

    testIgnore(members) {
        /**
         * @ignore members[number]
         */
        return members;
    }

    testAccept(filter) {
        /**
         * @accept filter{
         *      cost,
         *      time,
         *      distance
         * }
         */
        return filter;
    }
}

var myApp = hyron.getInstance(1234);
myApp.enablePlugins({
    validator: require('../src/fontware')
})
myApp.enableServices({
    "": Demo
})

myApp.startServer();