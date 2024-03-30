export type PromptLineType = 'prompt' | 'echo' | 'info';

export interface PromptLine {
  type: PromptLineType;
  text: string;
  path?: string;
  color?: string;
}

export interface PromptLineFixed extends PromptLine {
  user: string;
}
