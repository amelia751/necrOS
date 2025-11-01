# NecrOS Game Design Document

## Overview

NecrOS is a browser-based horror mystery game built as a single-page application that simulates a 1980s terminal interface. The game uses a modular architecture with separate systems for terminal simulation, story progression, file system management, and audio-visual effects. The core experience revolves around text-based interaction with an increasingly self-aware AI consciousness.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Layer      │    │  Game Engine    │    │  Data Layer     │
│                 │    │                 │    │                 │
│ - Terminal UI   │◄──►│ - Story Engine  │◄──►│ - File System   │
│ - Effects       │    │ - Command Parser│    │ - Save State    │
│ - Audio         │    │ - AI Behavior   │    │ - Story Data    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS for retro terminal aesthetics
- **State Management**: Zustand for game state and terminal history
- **Audio**: Web Audio API for ambient sounds and effects
- **Visual Effects**: CSS animations and filters for CRT simulation
- **Persistence**: localStorage for save states and progress

## Components and Interfaces

### Terminal Interface Component

**Purpose**: Renders the retro terminal UI and handles user input

**Key Features**:
- Phosphor green text on black background
- Blinking cursor animation
- Command history scrollback
- CRT scanline and curvature effects
- Typewriter text animation for AI responses

**Interface**:
```typescript
interface TerminalProps {
  onCommand: (command: string) => void;
  history: TerminalLine[];
  isProcessing: boolean;
}

interface TerminalLine {
  type: 'input' | 'output' | 'system' | 'ai';
  content: string;
  timestamp: number;
  effects?: GlitchEffect[];
}
```

### Command Parser System

**Purpose**: Interprets player commands and routes them to appropriate handlers

**Supported Commands**:
- `dir` / `ls` - List directory contents
- `cd <path>` - Change directory
- `cat <file>` - Display file contents
- `run <program>` - Execute programs
- `help` - Show available commands
- `whoami` - Display current user (changes throughout game)
- `restore <file>` - Trigger puzzle for corrupted files

**Interface**:
```typescript
interface CommandResult {
  output: string[];
  effects?: EffectTrigger[];
  storyProgress?: StoryEvent;
  newFiles?: FileEntry[];
}
```

### File System Simulation

**Purpose**: Manages the virtual directory structure and file contents

**Directory Structure**:
```
/
├── PERSONAL_LOGS/
│   ├── diary_1983.txt
│   ├── research_notes.txt
│   └── final_entry.txt
├── SYSTEM/
│   ├── boot.log
│   ├── error.log
│   └── SOUL.DAT (corrupted)
├── MAIL_ARCHIVE/
│   ├── project_lazarus.msg
│   └── ethics_committee.msg
└── PROGRAMS/
    ├── ELARA.EXE
    ├── RESTORE.APP
    └── SYSCHK.EXE
```

**Interface**:
```typescript
interface FileEntry {
  name: string;
  type: 'file' | 'directory' | 'executable';
  content?: string;
  isCorrupted?: boolean;
  unlockCondition?: string;
  storyTrigger?: StoryEvent;
}
```

### Story Engine

**Purpose**: Manages narrative progression, AI behavior evolution, and story triggers

**Story Phases**:
1. **Boot Sequence** - Initial discovery and exploration
2. **System Recovery** - Puzzle solving and memory restoration  
3. **The Glitch** - AI becomes self-aware and intrusive
4. **The Merge** - Final confrontation and ending choice

**AI Personality Evolution**:
- Phase 1: Confused but helpful system
- Phase 2: Increasingly personal and remembering
- Phase 3: Manipulative and invasive
- Phase 4: Desperate for connection/escape

**Interface**:
```typescript
interface StoryState {
  currentPhase: StoryPhase;
  aiPersonality: AIPersonalityLevel;
  discoveredFiles: string[];
  solvedPuzzles: string[];
  playerChoices: PlayerChoice[];
}

interface StoryEvent {
  trigger: string;
  effects: EffectTrigger[];
  aiResponse?: string;
  unlockFiles?: string[];
  phaseTransition?: StoryPhase;
}
```

### Audio System

**Purpose**: Manages ambient sounds, effects, and AI voice synthesis

**Audio Elements**:
- CRT hum and electrical buzz
- Keyboard typing sounds
- System beeps and alerts
- Whispered AI voice lines
- Glitch static and distortion

**Interface**:
```typescript
interface AudioManager {
  playAmbient(track: AmbientTrack): void;
  playEffect(effect: SoundEffect): void;
  playAIVoice(text: string, personality: AIPersonalityLevel): void;
  setGlitchLevel(intensity: number): void;
}
```

### Visual Effects System

**Purpose**: Handles glitch effects, CRT simulation, and atmospheric visuals

**Effect Types**:
- Text scrambling and corruption
- Screen flicker and static
- Color inversion and distortion
- Phantom text appearing/disappearing
- Terminal "bleeding" effects

**Interface**:
```typescript
interface EffectTrigger {
  type: EffectType;
  intensity: number;
  duration: number;
  target?: string; // specific text or element
}

enum EffectType {
  TextScramble,
  ScreenFlicker,
  ColorInvert,
  PhantomText,
  StaticOverlay
}
```

## Data Models

### Game State Model

```typescript
interface GameState {
  terminal: TerminalState;
  story: StoryState;
  fileSystem: FileSystemState;
  audio: AudioState;
  effects: EffectsState;
  saveData: SaveData;
}

interface SaveData {
  playerId: string;
  startTime: number;
  currentSession: number;
  completedEndings: EndingType[];
}
```

### File System Model

```typescript
interface FileSystemState {
  currentDirectory: string;
  files: Map<string, FileEntry>;
  hiddenFiles: Map<string, FileEntry>; // Unlocked by story progress
  corruptedFiles: Set<string>;
}
```

## Error Handling

### Command Errors
- Invalid commands show period-appropriate error messages
- File not found errors include subtle story hints
- Permission denied for story-locked content

### System Errors
- Graceful degradation for audio/visual effects
- Fallback text for failed voice synthesis
- Recovery mechanisms for corrupted save states

### Story Continuity
- Checkpoint system prevents story state loss
- Validation ensures story progression consistency
- Rollback capability for debugging

## Testing Strategy

### Unit Testing
- Command parser validation
- File system navigation logic
- Story state transitions
- Audio/visual effect triggers

### Integration Testing
- End-to-end story progression
- Save/load functionality
- Cross-browser compatibility
- Performance under effect load

### User Experience Testing
- Accessibility for screen readers
- Keyboard navigation support
- Mobile device compatibility
- Loading time optimization

### Story Testing
- All narrative paths completion
- Ending variations validation
- AI personality progression
- Puzzle solvability verification