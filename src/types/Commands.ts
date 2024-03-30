export interface ExecutableLine {
  function: string;
  async: boolean;
  speed: number;
  color: string;
}

export interface Command {
  name: string ;
  params?: string[];
  executionsLines: ExecutableLine[];
}
