import ExecuteLine from "./executeLine";

/* Interface for command */
export default interface Command {
    name: String;
    params: Array<String> | null;
    executionsLines: Array<ExecuteLine>; 
}