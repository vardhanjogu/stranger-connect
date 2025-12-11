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

export type Theme = 'dark' | 'light' | 'midnight' | 'forest';

export interface UserSettings {
  theme: Theme;
  notifications: boolean;
  topic?: string;
}

export interface ChatSessionConfig {
  topic?: string;
}