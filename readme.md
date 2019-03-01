**@hyron/validator** is a powerful library for validate input of function for more security

## Feature

- Validate by comment
- Light syntax
- Support ignore values in args with **@ignore**
- Support accept only values in args with **@accept**
- Support valid exactly values in args with **@valid**
- Support to check args value with **@check**
- High performance

# Usage

## **Step 1 : Install**

By **NPM** :
```shell
npm i @hyron/param-checker
```

By **YARN** :
```shell
yarn add @hyron/param-checker
```

## **Step 2 : Declare condition**

To used **Validator**, you need to declare condition first inside function.

Attentive : this package **only support for multi-line comment type** (/** or /*). For better support by IDE, you should used /** to declare condition

**Validator** support for 4 type of validator via comment :
- **@check** : used to check value of a argument with a variety of conditions
- **@ignore** : used to remove properties from argument if it match conditions
- **@accept** : used to select the parts to be retained by an argument if it match conditions
- **@valid** : used to check if argument is match with condition declared

Example
```js
function demo(arg1, arg2, arg3, arg4){
    /**
     * @check arg1 {type:string, size:20}
     * @check arg2 {size:10MB}
     * 
     * @ignore arg3 {
     *      key1,
     *      key2(string|number),
     *      key3[string],
     *      key4{
     *          child1,
     *          child2
     *      }
     * }
     * 
     * @accept arg3 {
     *      key4(string)
     * }
     * 
     * @valid arg4[{
     *      key1,
     *      key2
     * }]
     */
    ...
}
```

## Description

## 1. ``@check`` : check a argument if match

### **syntax**

```js
/**
 * @check arg_name {condition}
 * /
```
As you see, ``@check`` will take value from ``arg_name`` and compare it condition declared in a string like object (used [Hyron object-parser](https://github.com/hyron-group/hyron/blob/master/lib/objectParser.js) engine). If it not match, then **Validator** will throw a [HTTPMessage](https://docs.hyron.org/buildin-features/httpmessage.lib) that contain error info.

``@check`` supports a variety of conditions described below :

- **size** : limit size of argument. if input data is Buffer or ClientFile, size is byte-Length. Otherwise size will small than input.length. it also supported for unit, include : ``B``, ``KB``, ``MB``, ``GB``
- **length_from** : used for only string type. Used to check if length of string input greater than declared length
- **length_to** : used for only string type. Used to check if length of string input less than declared length
- **type** : input type can be accepted. it can be js primitive, or class type
- **mime** : input mime type. it can used for describe in more detail for ClientFile type. So, you can declare it first
- **lt** : less than. It can be used for number type
- **lte** : less than or equal ( <= )
- **gt** : greater than ( > )
- **gte** : greater than or equal ( >= )
- **eq** : equal. It can be used for primitive type ( == )
- **ne** : not equal ( != )
- **in** : input inside array of value ( array.includes )
- **nin** : input not inside array of value ( !array.includes )
- **reg** : input match regex condition. It must be used with string type ( reg.test )
- **nullable** : input value can be null. It must be declared first ( ==null )

## 2. ``@ignore`` : remove a nominated properties from argument

### **Syntax**
```js
/**
 * @ignore var_name { object-struct }
 * @ignore var_name ( allowed-type | other-type )
 * @ignore var_name [ allowed-type | object-struct | other-type ]
 * 
 * /
```

As you see, **@ignore** could used to check value of a variable, see if it fits a special type, check each element of the array, or check on key-value if it is a object. used [structure-parser](./docs/structure-parser.engine.md) engine. if it match with condition, then **Validator** will be remove this value from argument.

It could be used to against a no-sql inject, or for safe value before use this

## 2. ``@except`` : filter out the required values

### **Syntax**
```js
/**
 * @accept var_name { object-struct }
 * @accept var_name ( allowed-type | other-type )
 * @accept var_name [ allowed-type | object-struct | other-type ]
 * 
 * /
```

It also used a [structure-parser](./docs/structure-parser.engine.md) engine like ``@ignore`` abort

It could be used to against a no-sql inject, or for safe value before use this

## 2. ``@valid`` : strictly check the input value

### **Syntax**
```js
/**
 * @valid var_name { object-struct }
 * @valid var_name ( allowed-type | other-type )
 * @valid var_name [ allowed-type | object-struct | other-type ]
 * 
 * /
```

It also used a [structure-parser](./docs/structure-parser.engine.md) engine like ``@ignore`` abort

It could be used to against a no-sql inject, or for safe value before use this

## Step 3 : bind target function to used

**If you used hyron framework**, You just need to turn on it on necessary router

```js
class Demo {
    static requestConfig(){
        return {
            upload : {
                ...
                fontware : ["validator"]
            }
        }
    }

    upload(name, file){
        /**
         * @valid name(string)
         */
        ...
    }
}
```

**If not**, you also used it as a normal library by add this line inside function

```js
validator(argument.callee);
```

Example :
```js
var validator = require("@hyron/validator");

function upload(name, file){
    /**
    * @valid name(string)
    */
    
    validator(argument.callee);
}
```

