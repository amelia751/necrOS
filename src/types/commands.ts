// Command system interfaces
export interface CommandResult {
  output: string[];
  effects?: EffectTrigger[];
  storyProgress?: StoryEvent;
  newFiles?: FileEntry[];
  error?: string;
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  execute: (args: string[], context: CommandContext) => CommandResult;
}

export interface CommandContext {
  currentDirectory: string;
  fileSystem: FileSystemState;
  storyState: StoryState;
  terminalState: TerminalState;
}

export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

// Import types from other files
import { EffectTrigger } from './effects';
import { StoryEvent } from './story';
import { FileEntry } from './filesystem';
import { TerminalState, FileSystemState, StoryState } from './game';