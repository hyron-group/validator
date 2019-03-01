param-checker is simple fontware plugins of hyron framework, used to validate input data

## Feature

- Very easy to used
- Fully support the conditions
- Declare condition with comment
- Support pretty error log

## Usage
> ## npm i @hyron/param-checker

Syntax :
> ### // @param \<arg_name\> {\<condition\>}

after install, you need to declare this plugins into enablePlugins()

```js
...
myApp.enablePlugins({
    param_checker : require('@hyron/validator')
})

```

after declared, you can turn on param-checker inside your main-handler

```js
static requestConfig(){
    return {
        method_name : {
            method : "get",
            plugins : ["param_checker"]
        }
    }
}
...
```

in your main handler

```js
method_name(var1){
    // @param var1 { type : string, size : 6 }
}
```

if request with input don't satisfied, it will throw a error like : 

```html
Invalid param 'var1', check if param satisfying conditions 
type : string
size : 6
```

## Supported condition

- size : limit size of argument. if input data is Buffer or ClientFile, size is byte-Length. Otherwise size will small than input.length. it also supported for unit, include : B, KB, MB, GB
- type : input type can be accepted. it can be js primitive, or class type
- mime : input mime type. it can used for describe in more detail for ClientFile type. So, you can declare it first
- lt : less than. It can be used for number type
- lte : less than or equal
- gt : greater than
- gte : greater than or equal
- eq : equal. It can be used for primitive type
- ne : not equal
- in : input inside array of value
- nin : input not inside array of value
- reg : input match regex condition. It must be used with string type
- nullable : input value can be null. It must be declared first