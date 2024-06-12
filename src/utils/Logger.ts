/* eslint-disable no-console */
export type ConsoleOption = 'log' | 'error' | 'warning';

const unknownType = 'Unknown console type. Import ConsoleOption type to use correctly';

const executableConsole: { [key: string]: (...data: string[])=> void } = {
  log: console.log,
  error: console.error,
  warning: console.warn,
};

export const controllerLog = (
  message: string,
  type: ConsoleOption = 'log',
): void => {
  !executableConsole[type.toLowerCase()]
    ? console.log(unknownType)
    : executableConsole[type.toLowerCase()](message);
};
