/**
 * Used to register validate for a function by comment. Valid options include :
 * - [@check](../readme.md) : Check if the input parameter meets the condition
 * - [@ignore](../) : remove values from input if matched
 * - [@accept](../) : filter values from input if matched
 * - [@valid](../) : Only accept input parameters when it matches correctly
 * 
 * To know more about how to write validate condition, please visit [guide](https://github.com/hyron-group/plugins-validator/blob/master/readme.md)
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

/**
 * get checker by condition to validate input data
 * 
 * ### **params**
 * - **argsName** ( string ) : a name represent for input data
 * 
 * ### **return**
 * - **validator** ( function (args)=>void ) : a function that could be used to check function input data
 */
export function getConditionChecker(argsName?: string, conditionMap: object): (input) => boolean;

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
 * get checker by condition to validate input data
 * 
 * ### **params**
 * - **struct** ( string ) : a structure that defined for input data
 * - **key** ( string ) : a key that represent for this input data
 * - **onChecked** ( string ) : a function that will be called for each time a key was check
 * 
 * ### **return**
 * - **validator** ( function (args)=>void ) : a function that could be used to check function input data
 */
export function getStructChecker(struct: string, key?: string, onChecked: Function): { index: number, handler: (input) => any }