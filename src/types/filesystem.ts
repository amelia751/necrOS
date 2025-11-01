// File system interfaces
export interface FileEntry {
  name: string;
  type: 'file' | 'directory' | 'executable';
  content?: string;
  isCorrupted?: boolean;
  unlockCondition?: string;
  storyTrigger?: StoryEvent;
  size?: number;
  lastModified?: number;
  permissions?: FilePermissions;
}

export interface FilePermissions {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface DirectoryListing {
  files: FileEntry[];
  directories: FileEntry[];
  totalSize: number;
}

// Import types from other files
import { StoryEvent } from './story';