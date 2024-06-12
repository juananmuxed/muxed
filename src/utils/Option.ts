/* eslint-disable no-use-before-define */

export interface Option {
  value?: string;
  option: string;
}

const regExConfig = /^-[a-z]+/;

export class TerminalOptions {
  _options: string[];

  _params: string[];

  constructor(params: string[]) {
    this._params = params;
    this._options = [];
    let options: string[] = [];
    params.forEach((param) => {
      if (regExConfig.test(param)) {
        options = options.concat(param.substring(1).split(''));
      }
    });
    this._options = options.filter((value, index, array) => array.indexOf(value) === index);
  }

  getOption(option: string, hasValue = false) {
    if (this._options.find((_option) => _option === option)) {
      const index = this._params.findIndex((_param) => _param === `-${option}`);
      return {
        value: hasValue ? this._params[index + 1] : undefined,
        option,
      } as Option;
    }
    return undefined;
  }

  getParamsWithoutOptions() {
    const strings: string[] = this._params;
    const indexes: number[] = [];
    this._params.forEach((param) => {
      if (regExConfig.test(param)) {
        indexes.push(this._params.indexOf(param));
      }
    });
    strings.splice(indexes[0], this._params.length - indexes[0]);
    return strings;
  }
}
