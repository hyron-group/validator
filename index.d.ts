/**
 * Used to register validate for a function by comment. Valid options include :
 * - [@check](../readme.md) : Check if the input parameter meets the condition
 * - [@ignore](../) : remove values from input if matched
 * - [@accept](../) : filter values from input if matched
 * - [@valid](../) : Only accept input parameters when it matches correctly
 * 
 * To know more about how to write validate condition, please visit [guide](https://github.com/hyron-group/validator/blob/master/readme.md)
 * 
 * ### **params**
 * - **func** ( function ) : target function will be used to parser validate condition
 * - **eventName** ( string ) : a name represent for this validator. Default is func.name
 * 
 * ### **return**
 * - **validator** ( function (args)=>void ) : a function that could be used to check function input data
 */
export function registerValidator(func: Function, eventName?: string): (args) => void;

/**
 * Used to get a registered validator that have been registered before to check input data
 * 
 * ### **params**
 * - **eventName** ( string ) : a name represent for this validator. Default is func.name
 * 
 * ### **return**
 * - **validator** ( function (args)=>void ) : a function that could be used to check function input data
 */
export function getValidator(eventName: string): (args) => void;

declare interface Condition {
    /** Allow input nullable or not */
    nullable: boolean
    /** Size of input data. Support for unit KB, MB, GB */
    size: string | number,
    /** Check if input string with length greater than a number */
    length_from: number,
    /** Check if input string with length less than a number */
    length_to: number,
    /** Check type of input data. It also supported for ClientFile */
    type: any,
    /** Check mime type of input if type is ClientFile */
    mime: string,
    /** Check input if it less than a number */
    lt: number,
    /** Check input if it greater than a number */
    gt: number,
    /** Check input if it less than or equal a number */
    lte: number,
    /** Check input if it greater than or equal a number */
    gte: number,
    /** Check input if it equal a value */
    eq: any,
    /** Check input if it not equal a value */
    ne: any,
    /** Check input if it value inside a array of value */
    in: [any],
    /** Check input if it value not inside a array of value */
    nin: [any],
    /** Check input if it match a regex */
    reg: RegExp,
}

/**
 * get checker by condition to validate input data
 * 
 * ### **params**
 * - **condition** ( object ) : a name represent for input data
 * 
 * ### **return**
 * - **checker** ( function (input)=>void ) : a function that could be used to check function input data
 */
export function getConditionChecker(condition: Condition): (input) => boolean;

/**
 * A function that will be called on each key was checked. That could be used to notification or filter data
 * 
 * ### **params**
 * - **isMatch** ( boolean ) : check if this input data is match
 * - **key** ( string ) : A key of object or is index of array that will be checked
 * - **val** ( any ) : value that was checked on current key
 * - **origin** ( any ) : origin input data
 * 
 */
declare function onChecked(isMatch: boolean, key: string, val: any, origin: any): void;

/**
 * get checker by condition to validate input structure of data, used [structure parser engine](https://github.com/hyron-group/validator/blob/master/docs/structure-parsser.engine.md)
 * 
 * ### **params**
 * - **struct** ( string ) : a structure that defined for input data
 * - **onChecked** ( function ) : a function that will be called for each time a key was check
 * 
 * ### **return**
 * - **handler** ( (input)=>void ) : a function that could be used to check input structure
 */
export function getStructureChecker(struct: string, onChecked: Function): (input) => any