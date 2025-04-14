
export interface AIContextType {
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  generateContent: (prompt: string) => Promise<string>;
}
