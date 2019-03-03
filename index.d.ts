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
export function registerValidator(func: Function, eventName ?: string) : (args) => void;

/**
 * Used to get a registered validator that have been registered before to check input data
 * 
 * ### **params**
 * - **eventName** ( string ) : a name represent for this validator. Default is func.name
 * 
 * ### **return**
 * - **validator** ( function (args)=>void ) : a function that could be used to check function input data
 */
export function getValidator(eventName: string) : (args) => void;
