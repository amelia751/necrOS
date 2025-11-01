// Story and narrative interfaces
import { EffectTrigger } from './effects';
export enum StoryPhase {
  BootSequence = 'boot_sequence',
  SystemRecovery = 'system_recovery',
  TheGlitch = 'the_glitch',
  TheMerge = 'the_merge'
}

export enum AIPersonalityLevel {
  Confused = 'confused',
  Remembering = 'remembering',
  Manipulative = 'manipulative',
  Desperate = 'desperate'
}

export enum EndingType {
  Accept = 'accept',
  Refuse = 'refuse',
  Delete = 'delete'
}

export interface PlayerChoice {
  id: string;
  choice: string;
  timestamp: number;
  storyPhase: StoryPhase;
}

export interface StoryEvent {
  trigger: string;
  effects: EffectTrigger[];
  aiResponse?: string;
  unlockFiles?: string[];
  phaseTransition?: StoryPhase;
}

export interface AIResponse {
  text: string;
  personality: AIPersonalityLevel;
  effects?: EffectTrigger[];
  delay?: number;
}