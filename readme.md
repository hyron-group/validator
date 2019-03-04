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
     * @check arg1 {type:string, size:20} - check if arg1 is string with max length is 20
     * @check arg2 {size:10MB} - check if size of arg2 is less than 10485760 byte for buffer input type
     * 
     * @ignore arg3 {
     *      key1, 
     *      key2(string|number),
     *      key3[string],
     *      key4{
     *          child1,
     *          child2
     *      }
     * } - ignore data from arg3 as object if field matched
     * 
     * @accept arg3 {
     *      key4(string)
     * } - filtered arg3 with matched field
     * 
     * @valid arg4[{
     *      key1(string),
     *      key2(number)
     * }] - only accept for arg4 with exactly structure
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

| Condition       | Description                                                                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **size**        | limit size of argument. if input data is Buffer or ClientFile, size is byte-Length. Otherwise size will small than input.length. It also supported for unit, include : ``B``, ``KB``, ``MB``, ``GB`` |
| **length_from** | used for only string type to check if length of string input greater than declared length                                                                                                            |
| **length_to**   | used for only string type to check if length of string input less than declared length                                                                                                               |
| **type**        | input type can be accepted. it can be js primitive, or class type                                                                                                                                    |
| **mime**        | used to check input mime type. It can used for describe in more detail for ``ClientFile`` type (by [Busboy](https://www.npmjs.com/package/busboy) for upload file). Ex : 'image/img'                 |
| **lt**          | check if input less than. It can be used for number type                                                                                                                                             |
| **lte**         | check if input less than or equal a value ( <= )                                                                                                                                                     |
| **gt**          | check if input greater than a value ( > )                                                                                                                                                            |
| **gte**         | check if input greater than or equal a value ( >= )                                                                                                                                                  |
| **eq**          | check if input equal a value. It can be used for primitive type ( == )                                                                                                                               |
| **ne**          | check if input not equal ( != )                                                                                                                                                                      |
| **in**          | check if input is element of array ( array.includes )                                                                                                                                                |
| **nin**         | check if input is not element of array ( !array.includes )                                                                                                                                           |
| **reg**         | check if input match a regex. It must be used with string type ( reg.test )                                                                                                                          |
| **nullable**    | input value can be null. It must be declared first ( ==null )                                                                                                                                        |

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
var checker = validator.getValidator(current_function_name);
checker(Array.from(arguments));
```

And add follow line to bellow of ``js`` file
```js
validator.registerValidator(target_function);
```

Example :
```js
var validator = require("../");

function test(var1, var2){
    /**
     * @check var1 {type:string, size: 10} - check if var1 is string with length < 10
     * @ignore var2(string) - ignore if var2 is string
     */

     var checker = validator.getValidator(test.name);
     checker(Array.from(arguments));
}

validator.registerValidator(test);
```

# API Reference

>## function **registerValidator**( func, eventName ? ) : (args) => void

  Used to register validate for a function by comment. Valid options include :
  - [@check](../readme.md) : Check if the input parameter meets the condition
 - [@ignore](../) : remove values from input if matched
  - [@accept](../) : filter values from input if matched
  - [@valid](../) : Only accept input parameters when it matches correctly
  
  To know more about how to write validate condition, please visit [guide](https://github.com/hyron-group/plugins-validator/blob/master/readme.md)
  
  ### **params**
  - **func** ( function ) : target function will be used to parser validate condition
  - **eventName** ( string ) : a name represent for this validator. Default is func.name
  
  ### **return**
  - **validator** ( function (args)=>void ) : a function that could be used to check function input data

> ## function **getValidator**( eventName ) : (args) => void

Used to get a registered validator that have been registered before to check input data
  
### **params**
- **eventName** ( string ) : a name represent for this validator. Default is func.name
  
### **return**
- **validator** ( function (args)=>void ) : a function that could be used to check function input data
