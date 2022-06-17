export default interface Option {
  value: String;
  params: Array<String>;
  index: number;
}

export const clearOption = (
  params: Array<String>,
  optionString: String
): Option => {
  const option = checkOptions(params, optionString);
  return {
    value: option.value,
    params: deleteOption(params, option),
    index: option.index,
  };
};

export const checkOptions = (
  params: Array<String>,
  option: String
): Option => {
  const indexOption = params.findIndex((v) => v == `-${option}`);
  if (indexOption >= 0) {
    return {
      value: params[indexOption + 1],
      index: indexOption,
      params: params,
    };
  }
  return { value: "", index: -1, params: params };
};

export const deleteOption = (
  params: Array<String>,
  option: Option
): Array<String> => {
  if (option.index >= 0) params.splice(option.index, 2);
  return params;
};
