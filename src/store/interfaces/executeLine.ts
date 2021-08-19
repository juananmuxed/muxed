/* Interface for executed command to line */
export default interface ExecuteLine {
    type: String;
    function: String;
    async: Boolean; 
    speed: Number | null;
    color: String | null;
}