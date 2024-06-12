export type FileType = 'D' | 'F';

export interface TerminalFile {
  id: number;
  type: FileType;
  name: string;
  extension?: string;
  parent?: number;
  permits: string[];
  size: number;
  owner: string;
  creationDate: Date;
}
