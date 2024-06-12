import { useTerminal } from 'src/composables/UseTerminal';

const terminal = useTerminal();

type ExecutableFunction = keyof typeof terminal.executableFunctions;

export interface ExecutableLine {
  function: ExecutableFunction;
  async?: boolean;
  speed?: number;
  color?: string;
}

export interface Command {
  name: string ;
  params?: string[];
  executionsLines: ExecutableLine[];
  searchFiles?: boolean;
}
