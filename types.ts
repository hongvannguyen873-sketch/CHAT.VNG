
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
