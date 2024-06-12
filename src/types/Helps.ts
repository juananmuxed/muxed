import { PromptLine } from './PromptLine';

export interface Help {
  command: string;
  lines: PromptLine[];
}
