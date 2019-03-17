**@hyron/validator** is a powerful library for validate input of function for more security



## Feature

- Validate by comment
- Light syntax
- Support ignore values in args with **@ignore**
- Support accept only values in args with **@accept**
- Support valid exactly values in args with **@valid**
- Support to check args value with **@check**
- Friendly with the [Hyron Framework](https://docs.hyron.org)
- Compatible with Library Interface
- High performance

# Usage

## **Step 1 : Install**

By **NPM** :
```shell
npm i @hyron/validator
```

By **YARN** :
```shell
yarn add @hyron/validator
```

## **Step 2 : Declare condition**

To used **Validator**, you need to declare condition first inside function.

Attentive : this package **only support for multi-line comment type** (/** or /*). For better support by IDE, you should used /** to declare condition

**Validator** support for 4 type of validator via comment :
  - [1. ``@check`` : check a argument if match](#1-check--check-a-argument-if-match)
  - [2. ``@ignore`` : remove a nominated properties from argument](#2-ignore--remove-a-nominated-properties-from-argument)
  - [3. ``@except`` : filter out the required values](#3-except--filter-out-the-required-values)
  - [4. ``@valid`` : strictly check the input value](#4-valid--strictly-check-the-input-value)

# API Reference

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

to see more about attributes, please read : [Validator Attribute](#attributes)

# Step 3 : bind target function to used

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

**If not**, you also used it as a normal library by add this line inside function to check input data

```js
var checker = validator.getValidator(current_function_name);
checker(Array.from(arguments));
```

And add follow line to bellow of ``js`` file to register a validator
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


# Attributes

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

## 3. ``@except`` : filter out the required values

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

## 4. ``@valid`` : strictly check the input value

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


> ## function **getConditionChecker**( argsName, conditionMap ) : checker

 get checker by condition to validate input data
  
  ### **params**
  - **argsName** ( string ) : a name represent for input data
  
  ### **return**
  - **checker** ( function (args)=>boolean ) : a function that could be used to check function input data


> ## function **getStructChecker** ( struct, key, onChecked ) : { index, handler }
  get checker by condition to validate input structure of data used [structure parser engine](https://github.com/hyron-group/validator/blob/master/docs/structure-parsser.engine.md)
  
### **params**
  - **struct** ( string ) : a structure that defined for input data
  - **key** ( string ) : a key that represent for this input data
  - **onChecked** ( function ) : a function that will be called for each time a key was check
  
 ### **return**
 - **index** ( number ) : last index of condition structure
 - **handler** ( (input)=>void ) : a function that could be used to check input structure


> ## declared function **onChecked**( isMatch, key, val, origin) : void

A function that will be called on each key was checked. That could be used to notification or filter data
  
### **params**

- **isMatch** ( boolean ) : check if this input data is match
- **key** ( string ) : A key of object or is index of array that will be checked
- **val** ( any ) : value that was checked on current key
- **origin** ( any ) : origin input data
  