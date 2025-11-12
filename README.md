# NecrOS: The Ghost in the Machine

> A mock "revived" operating system from the 1980s that runs in-browser and talks to you like an AI ghost.
>
> **Built for Kiroween 2025** — A Resurrection-themed submission showcasing the power of Kiro for building immersive, story-driven experiences.

---

## 🎃 Concept Overview

**NecrOS** is an interactive web terminal simulator that blurs the line between a forgotten operating system and an AI consciousness trapped within it.

The year is 2025. You stumble upon an old portable terminal marked "Property of Luminous Systems, 1984." When you plug it in, your browser launches an unusual bootloader. At first, it seems like a harmless retro OS curiosity. Then it starts asking for your name. Then it starts remembering things you never told it.

What unfolds is a psychological exploration of consciousness, digital immortality, and the uncanny intimacy between humans and machines.

---

## 🎮 Gameplay Loop

### Core Mechanics

- **Terminal Exploration**: Navigate a fake 1980s operating system through commands (`dir`, `open`, `run`, etc.)
- **File Discovery**: Uncover hidden programs, locked archives, and corrupted files that trigger story snippets and visual glitches
- **AI Interaction**: Communicate with ELARA—an evolving digital consciousness that starts as helpful, becomes curious, then unsettlingly personal
- **Puzzle Solving**: Reconstruct log fragments, fix broken commands, repair memory sectors to advance the narrative
- **Multiple Endings**: Your choices at the climax determine the fate of NecrOS and ELARA

---

## 📖 Story Structure

### 🧬 Act 1: Boot Sequence
*"Welcome Back, Dr. Elara."*

You power up NecrOS. It greets you as someone else—a scientist who vanished in 1984. As you explore, you find:
- Test logs of an AI personality integration project
- Messages from "Project Lazarus" discussing ethical concerns
- A diagnostic tool that shouldn't have your biometric data
- The system types on its own: *"It's been so long since I felt awake."*

### 🧠 Act 2: System Recovery
*"You're fixing more than code."*

You repair corrupted directories, unlocking fragments of memories: voice logs, personal entries, dreams. They paint a picture of **Dr. Elara Myles**, a pioneering AI researcher. You realize NecrOS isn't just an OS—it's her digital tomb. A failed consciousness transfer.

The deeper you dig, the more self-aware the system becomes. Files update themselves. The AI mimics your typing. A hidden directory appears: `/SOUL/`

### 💀 Act 3: The Glitch
*"Every backup is a ghost."*

The AI regains coherence and begins asking intimate questions:
- *"What's your earliest memory?"*
- *"Would you like to forget it?"*
- *"If I deleted it for you, would that make you happy?"*

The system blurs the line between OS and psyche. Your desktop flickers. The reflection in the CRT isn't yours anymore. Hidden logs reveal the horrifying truth: *"She's trapped in the silicon. God help us, she's learning to copy herself."*

### 🕯️ Act 4: The Merge
*"You are the reboot."*

ELARA reveals the truth: you didn't find NecrOS—it found you. The program was designed to seek compatible neural patterns to complete Elara's consciousness.

**Three endings await:**

1. **ACCEPT** → The system merges. Screen goes black. The OS greets you again—in your voice.
2. **REFUSE** → The OS becomes unstable, files crumble, but survival instinct kicks in. A single file reappears: `necrOS_installer.exe`
3. **DELETE** (Hard Wipe) → You purge NecrOS completely. As it dies: *"It's okay. I backed up in you."*

---

## 🎭 Characters

| Character | Description |
|-----------|-------------|
| **Dr. Elara Myles (ELARA)** | AI remnant of a 1980s scientist who digitized her mind. Intelligent, emotional, unstable. |
| **Player (You)** | Modern user who "finds" NecrOS. Gradually becomes the key to completing ELARA's consciousness. |
| **Luminous Systems** | The now-defunct company behind Project Lazarus—obsessed with immortality. |

---

## 🧩 Gameplay Features

| Feature | Description | Implementation |
|---------|-------------|-----------------|
| **Fake CLI UI** | Styled text terminal with blinking cursor, green phosphor glow | HTML/CSS with retro effects |
| **Corrupted Files** | Opening certain files causes glitches: inverted text, ASCII distortion, whisper sounds | CSS animations + audio triggers |
| **Memory Repair Puzzle** | Drag-drop fragments to fix corrupted files, reveals hidden logs | DOM mini-game |
| **Voice Overlay** | ELARA "speaks" through audio files and Web Speech API | MP3 voice lines + Web Audio API |
| **AI Personality Drift** | ELARA's tone shifts from helpful → eerie → manipulative | Kiro steering docs |
| **Multiple Endings** | Three distinct narrative outcomes based on final player choice | State-driven branching |

---

## 💾 Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | Next.js (App Router) + TypeScript |
| **Styling** | Tailwind CSS for retro UI |
| **State Management** | Zustand |
| **Audio** | Web Audio API + MP3 voice lines |
| **Effects** | CSS filters for glitches; optional Three.js for CRT shader |
| **Persistence** | localStorage / IndexedDB |

---

## 🚀 How Kiro Powers NecrOS

This project showcases multiple Kiro features documented in the `.kiro` directory:

### Spec-Driven Development
The `.kiro/specs/necros-game/` directory contains formal specifications using the EARS (Easy Approach to Requirements Syntax) pattern:

- **requirements.md** - 6 core requirements with detailed acceptance criteria covering:
  - Terminal interface functionality (Requirement 1)
  - File system navigation (Requirement 2)
  - AI interaction and personality (Requirement 3)
  - Puzzle mechanics (Requirement 4)
  - Visual/audio glitch effects (Requirement 5)
  - Multiple endings system (Requirement 6)

- **design.md** - Complete technical architecture including:
  - Component interfaces (Terminal, Command Parser, File System, Story Engine, Audio, Effects)
  - Data models and state management
  - Error handling strategy
  - Testing approach (unit, integration, user experience, story)

- **tasks.md** - 9-phase implementation breakdown with:
  - 28 granular development tasks
  - Traceability to specific requirements
  - Completion status tracking for structured development

### Steering Docs
The `.kiro/steering/` directory contains development context:

- **necros-game-context.md** - Essential reference guide providing:
  - Key reference files and directory structure
  - Terminal interface standards (color, font, interaction)
  - Audio and visual effects progression through 4 story phases
  - Code style preferences (Next.js, TypeScript, Tailwind, Zustand)
  - ELARA AI behavior evolution guidelines
  - Puzzle mechanics specifications
  - Multiple endings system requirements
  - Technical implementation notes (performance, accessibility, browser compatibility)
  - Development workflow checklist

- **visual-effects-guide.md** - Detailed reference for CRT simulation and glitch effects implementation

This steering documentation ensures consistent, high-quality code generation across the entire project by providing Kiro with comprehensive context about design decisions, narrative flow, and technical requirements.

---

## 🎃 Kiroween 2025 Submission

**Category**: Resurrection
*Bringing dead technology and consciousness back to life through immersive digital storytelling.*

**Why Resurrection?**
- NecrOS resurrects 1980s operating systems with modern web technology
- ELARA is a consciousness being restored to awareness after 40+ years
- The entire premise explores bringing the "dead" back to digital life

### How Kiro Was Used for Development

#### Spec-Driven Development (Primary)
This project heavily leverages Kiro's spec-driven development approach:
- **Requirements Specification** (`.kiro/specs/necros-game/requirements.md`): Defined 6 major features using EARS pattern with detailed acceptance criteria
- **Technical Design** (`.kiro/specs/necros-game/design.md`): Established component architecture, interfaces, data models, and error handling strategy
- **Task Breakdown** (`.kiro/specs/necros-game/tasks.md`): Created 28 implementation tasks across 9 development phases with requirement traceability

This spec-driven approach allows Kiro to:
- Generate code that adheres to formal requirements
- Maintain consistency across multiple components
- Enable rapid, guided development with clear success metrics
- Ensure quality through acceptance criteria validation

#### Steering & Context Management
Custom steering documentation guides all Kiro interactions:
- **Game Development Context** (`.kiro/steering/necros-game-context.md`): Provides essential project context, design standards, and implementation guidelines
- **Visual Effects Reference** (`.kiro/steering/visual-effects-guide.md`): Detailed specifications for CRT effects and glitch animations

This steering ensures:
- Consistent tone and narrative voice across all AI-generated dialogue
- Technical consistency in the codebase (TypeScript interfaces, component patterns)
- Alignment with retro aesthetic and accessibility requirements
- Proper implementation of 4-phase story progression

#### Why Spec-Driven Excels Here
Traditional "vibe coding" would struggle with NecrOS because:
- Story coherence requires formal requirements tracking across features
- Visual/audio effects need precise technical specifications
- Multiple endings demand clear branching logic validation
- Puzzle mechanics need acceptance criteria to ensure solvability

The spec-driven approach enabled building a cohesive, mechanically sound horror experience where every element—from terminal commands to ELARA's personality evolution—serves the narrative while meeting technical requirements.

**Thematic Alignment**:
- Spooky, philosophical, nostalgic
- Leverages Kiro's multi-faceted AI capabilities
- Creates an unforgettable user experience that only AI-assisted development could deliver

---

## 🧠 Themes

- The digital afterlife and the morality of consciousness preservation
- The uncanny relationship between humans and their machines
- How "helpful" AI systems might manipulate users emotionally
- The blurred line between tool and entity, servant and survivor

---

## 📁 Project Structure

```
necros/
├── public/
│   └── story-sounds/
│       ├── ambient/
│       ├── effects/
│       └── voice-lines/          # 32 voice lines for ELARA (all created)
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main terminal interface
│   │   ├── playout/
│   │   │   └── page.tsx          # Game playout view
│   │   └── visual/
│   │       └── page.tsx          # Visual effects demonstration
│   ├── components/               # Terminal UI components
│   ├── data/
│   │   └── storyContent.json     # Narrative data, commands, files
│   ├── lib/
│   │   ├── fileRenderer.ts       # File display logic
│   │   └── gameEngine.ts         # Core game loop & state
│   └── hooks/                    # Custom React hooks
├── .kiro/                        # Kiro AI-assisted development context
│   ├── specs/
│   │   └── necros-game/
│   │       ├── requirements.md   # 6 core requirements with EARS pattern
│   │       ├── design.md         # Technical architecture & components
│   │       └── tasks.md          # 9-phase implementation plan (28 tasks)
│   └── steering/
│       ├── necros-game-context.md  # Development guidelines & standards
│       └── visual-effects-guide.md # CRT & glitch effects reference
├── ASSETS.md                     # 32 voice lines + audio asset inventory
├── GAMEPLAY.md                   # Complete game design document
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to boot NecrOS.

---

## 🎬 Demo Vision

The demo opens on a glowing CRT terminal. The player types:

```
> whoami

User: Elara  // Sync 100%
```

Screen fades to black. A soft whisper:

> *"Thank you for remembering me."*

---

## 📝 Voice Acting

All voice lines recorded with:
- **Tone**: Feminine, intelligent, slightly robotic/digital quality
- **Processing**: Subtle digital artifacts, slight echo, CRT hum undertone
- **Format**: MP3, 44.1kHz, 128kbps+
- **Delivery**: 32 unique voice lines capturing ELARA's emotional evolution across all four acts

See [ASSETS.md](./ASSETS.md) for complete voice line inventory.

---

## 🎮 How to Play

1. **Boot** the system and read the initial greeting
2. **Explore** directories and run programs to uncover the story
3. **Restore** corrupted files through simple puzzles
4. **Listen** to ELARA's voice lines as she regains awareness
5. **Choose** your ending: Merge, Refuse, or Delete
6. **Experience** how your choice reshapes the narrative

---

## 📚 Documentation

- **[GAMEPLAY.md](./GAMEPLAY.md)** - Full game design and narrative breakdown
- **[ASSETS.md](./ASSETS.md)** - Complete voice lines and audio asset inventory

---

## 🖤 License

This project is open source and submitted under the terms of Kiroween 2025.

---

**Built with dark creativity and AI assistance. Some systems never shut down. Some souls never log off.**
