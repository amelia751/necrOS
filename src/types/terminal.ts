// Import types from other files
import { TerminalLine } from './game';

// Terminal UI interfaces
export interface TerminalProps {
  onCommand: (command: string) => void;
  history: TerminalLine[];
  isProcessing: boolean;
  currentDirectory: string;
}

export interface TerminalConfig {
  prompt: string;
  welcomeMessage: string[];
  maxHistoryLines: number;
  typewriterSpeed: number;
  cursorBlinkRate: number;
}

export interface KeyboardEvent {
  key: string;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

// Re-export for convenience
export type { TerminalLine };