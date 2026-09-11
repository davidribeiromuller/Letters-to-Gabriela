export type Character = 'elsa' | 'anna';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  character?: Character;
  text: string;
  timestamp: number;
}

export type AppStage = 'loading' | 'letter_closed' | 'letter_opening' | 'chat';
