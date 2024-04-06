export type PromptLineType = 'prompt' | 'echo' | 'info';
export type PromptColor = 'info' | 'success' | 'error' | 'error-light';

export interface PromptLine {
  type: PromptLineType;
  text: string;
  path?: string;
  color?: PromptColor;
}

export interface PromptLineFixed extends PromptLine {
  user: string;
}
