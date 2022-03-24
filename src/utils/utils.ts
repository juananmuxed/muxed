import Option from '@/store/interfaces/option';

/**
* Create a promise for await until resolve
*
* @package utils
* @param {number} ms Milliseconds to wait
* @returns {Promise<void>} Promise
*/
const sleep = (ms: number | null): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms || 1000));
}

/**
* Create a random number between min and max
*
* @package utils
* @param {number} minSpeed Minimum speed in ms -> Default: 0
* @param {number} maxSpeed The child you want to access
* @returns {number} Random number between minSpeed and maxSpeed
*/
const randomSpeed = (minSpeed: number = 0, maxSpeed: number): number | null => {
  if (!maxSpeed || maxSpeed < 1) return null;
  return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
}

/**
* Check options
*
* @package utils
* @param {array} params Array of params with options
* @returns {CommandOption|undefined} Object of command options
*/
const checkOptions = (params: Array<String>, option: String): Option => {
  const indexOption = params.findIndex(v => v == `-${option}`);
  if (indexOption >= 0) {
    return { value: params[indexOption + 1], index: indexOption, params: params };
  }
  return { value: '', index: -1, params: params };
}

/**
* Delete 2 items in array
*
* @package utils
* @param {array} params Array of params with options
* @param {number} index Index
* @returns {array} Clean new array
*/
const deleteOption = (params: Array<String>, option: Option): Array<String> => {
  if (option.index >= 0) params.splice(option.index, 2);
  return params;
}

/**
* Clear option and return value and option
*
* @package utils
* @param {array} params Array of params with options
* @returns {array} Clean new array and value
*/
const clearOption = (params: Array<String>, optionString: String): Option => {
  const option = checkOptions(params, optionString);
  return {
    value: option.value,
    params: deleteOption(params, option),
    index: option.index
  }
}

export { sleep, randomSpeed, checkOptions, deleteOption, clearOption };