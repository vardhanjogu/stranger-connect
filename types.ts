export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export enum AppState {
  LANDING = 'LANDING',
  MATCHING = 'MATCHING',
  CHAT = 'CHAT',
}

export interface ChatSessionConfig {
  topic?: string;
}
