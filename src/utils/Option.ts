/* eslint-disable no-use-before-define */

export interface Option {
  value: string;
  params: string[];
  index: number;
}

export const clearOption = (
  params: string[],
  optionString: string,
): Option => {
  const option = checkOptions(params, optionString);
  return {
    value: option.value,
    params: deleteOption(params, option),
    index: option.index,
  };
};

export const checkOptions = (
  params: string[],
  option: string,
): Option => {
  const indexOption = params.findIndex((value) => value === `-${option}`);
  if (indexOption >= 0) {
    return {
      value: params[indexOption + 1],
      index: indexOption,
      params,
    };
  }
  return { value: '', index: -1, params };
};

export const deleteOption = (
  params: string[],
  option: Option,
): string[] => {
  if (option.index >= 0) params.splice(option.index, 2);
  return params;
};
