// Core game state interfaces
import { GlitchEffect, EffectTrigger, AmbientTrack } from './effects';
import { StoryPhase, AIPersonalityLevel, PlayerChoice, EndingType } from './story';
import { FileEntry } from './filesystem';
export interface GameState {
  terminal: TerminalState;
  story: StoryState;
  fileSystem: FileSystemState;
  audio: AudioState;
  effects: EffectsState;
  saveData: SaveData;
}

export interface TerminalState {
  history: TerminalLine[];
  currentDirectory: string;
  isProcessing: boolean;
  commandHistory: string[];
  historyIndex: number;
}

export interface TerminalLine {
  type: 'input' | 'output' | 'system' | 'ai';
  content: string;
  timestamp: number;
  effects?: GlitchEffect[];
}

export interface StoryState {
  currentPhase: StoryPhase;
  aiPersonality: AIPersonalityLevel;
  discoveredFiles: string[];
  solvedPuzzles: string[];
  playerChoices: PlayerChoice[];
}

export interface FileSystemState {
  currentDirectory: string;
  files: Map<string, FileEntry>;
  hiddenFiles: Map<string, FileEntry>;
  corruptedFiles: Set<string>;
}

export interface AudioState {
  ambientTrack?: AmbientTrack;
  effectsEnabled: boolean;
  volume: number;
  glitchLevel: number;
}

export interface EffectsState {
  activeEffects: EffectTrigger[];
  intensity: number;
  crtEnabled: boolean;
}

export interface SaveData {
  playerId: string;
  startTime: number;
  currentSession: number;
  completedEndings: EndingType[];
}