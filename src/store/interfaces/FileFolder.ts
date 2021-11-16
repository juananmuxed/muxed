/* Interface for folder and files */
export default interface FileFolder {
    id: Number;
    type: String;
    name: String;
    extension: String | null;
    parent: Number | null;
    permits: Array<String>;
    size: Number;
    owner: String;
    creationDate: String;
}