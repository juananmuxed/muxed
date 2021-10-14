/* Interface for executed command to line */
export default interface ExecuteLine {
    type: String;
    function: string;
    async: Boolean; 
    speed?: Number;
    color?: String;
}