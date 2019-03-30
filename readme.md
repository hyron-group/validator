
[![Build status](https://ci.appveyor.com/api/projects/status/scqq323ay7cilq79?svg=true)](https://ci.appveyor.com/project/thangdjw/validator)
![Gitter](https://img.shields.io/gitter/room/hyron-group/community.svg)
![npm](https://img.shields.io/npm/dm/@hyron/validator.svg)


**@hyron/validator** is a powerful library for validate input of function for more security

## Features

- Validate by comment
- Support validate value
- Support validate structure
- Support for [Hyron Framework](https://docs.hyron.org)
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

## **Step 2 : Validate data**

To check input data with complex condition, using `getConditionChecker(..)` function

```js
const validator = require("@hyron/validator");

var checker = validator.getConditionChecker({
    type : "number",
    lt : 10,
    gt : 0
});

checker(4); // allow
checker("hi"); // has error
checker(12); // has error
```

To check input structure of input. using `getStructureChecker(..)` function. For more info, checkout [structure parser engine](./docs/structure-parser.engine.md)

```js
const validator = require("@hyron/validator");

var checker = validator.getStructureChecker(`
{key1(string)}
`);

checker({key1:null}); // allow
checker({key1: 34}); // has error
checker({key1:"hi"}); // allow
```

validator also support to used comment for validator to validate function arguments easier. View [Validate by Comment](./docs/comment-validate.md) for more info

```js
function demo(arg1){
    /**
     * @check arg1 {type:string, size:20} - check if arg1 is string with max length is 20
     */
    ...
}
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
- (args)=>void : a function that could be used to check function input data


> ## function **getConditionChecker**( conditionMap ) : checker

 get checker by condition to validate input data
  
  ### **params**
  - **argsName** ( string ) : a name represent for input data
  
  ### **return**
  - (input)=>boolean : a function that could be used to check function input data


> ## function **getStructureChecker** ( struct ) : (input)=>void
  get checker by condition to validate input structure of data used [structure parser engine](https://github.com/hyron-group/validator/blob/master/docs/structure-parser.engine.md)
  
### **params**
  - **struct** ( string ) : a structure that defined for input data
  
 ### **return**
 - (input)=>void : a function that could be used to check input structure
