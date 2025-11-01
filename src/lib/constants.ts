// Game constants and configuration
export const GAME_CONFIG = {
  name: 'NecrOS',
  version: '1.0.4',
  year: '1984',
  maxHistoryLines: 1000,
  typewriterSpeed: 50, // ms per character
  cursorBlinkRate: 1000, // ms
  autoSaveInterval: 30000, // 30 seconds
} as const;

export const TERMINAL_CONFIG = {
  prompt: 'C:\\>',
  welcomeMessage: [
    'NecrOS v1.0.4 (c) 1984 Lazarus Systems',
    'Boot sequence complete.',
    'Type "help" for available commands.',
    '',
  ],
  commands: {
    help: 'Display available commands',
    dir: 'List directory contents',
    cd: 'Change directory',
    cat: 'Display file contents',
    run: 'Execute program',
    whoami: 'Display current user',
    restore: 'Restore corrupted files',
    cls: 'Clear screen',
    exit: 'Exit system',
  },
} as const;

export const STORY_CONFIG = {
  phases: {
    boot: 'Boot Sequence',
    recovery: 'System Recovery',
    glitch: 'The Glitch',
    merge: 'The Merge',
  },
  aiNames: {
    system: 'SYSTEM',
    elara: 'Dr. Elara',
    ai: 'ELARA',
    corrupted: '3L4R4',
  },
} as const;