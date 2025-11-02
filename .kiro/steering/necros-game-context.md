---
inclusion: always
---

# NecrOS Game Development Context

## Project Overview
NecrOS is a browser-based horror mystery game that simulates a 1980s terminal interface containing the trapped consciousness of Dr. Elara Myles. This steering document provides essential context for development work on this project.

## Key Reference Files

### Core Game Design
- **#[[file:GAMEPLAY.md]]** - Complete game plot, story phases, and narrative structure
- **#[[file:SCRIPT.md]]** - Detailed game script with dialogue, audio cues, and visual effects
- **#[[file:ASSETS.md]]** - Comprehensive asset list including audio, visual effects, and story content

### Technical Specifications
- **#[[file:.kiro/specs/necros-game/requirements.md]]** - Formal requirements with EARS patterns
- **#[[file:.kiro/specs/necros-game/design.md]]** - Technical architecture and component design
- **#[[file:.kiro/specs/necros-game/tasks.md]]** - Implementation task breakdown

### Visual Effects Reference
- **#[[file:src/app/visual/page.tsx]]** - Interactive visual effects demonstration with CSS implementations

## Story Content Structure
All story content files are organized in `/public/story-content/` with the following structure:
- `personal-documents/` - Dr. Elara's diary entries and personal files
- `system-files/` - System logs, corrupted data, and technical files  
- `email-archive/` - Project Lazarus email communications
- `program-files/` - Executable programs for player interaction

## Development Guidelines

### Terminal Interface Standards
- **Color Scheme:** Phosphor green (#00FF41) on pure black background
- **Font:** Monospace (Courier New or similar retro terminal font)
- **Effects:** CSS-based CRT scanlines, curvature, and glow effects
- **Interaction:** Command-line interface with dir, cd, cat, run, help, whoami commands

### Audio Implementation
Use only the core audio assets listed in ASSETS.md. Extended audio assets are optional enhancements. For missing sounds, substitute with existing assets as specified in the "Audio Implementation Strategy" section.

### Visual Effects Progression
- **Phase 1 (Boot):** Clean terminal, minimal effects
- **Phase 2 (Recovery):** Occasional flicker, brief distortions
- **Phase 3 (Glitch):** Regular glitches, phantom text, color shifts
- **Phase 4 (Merge):** Dramatic distortions, reality-bending effects

### Story Phase Management
The game progresses through 4 distinct phases based on player actions:
1. **Boot Sequence** - ELARA is confused, helpful
2. **System Recovery** - ELARA becomes personal, remembering
3. **The Glitch** - ELARA becomes manipulative, invasive
4. **The Merge** - ELARA becomes desperate, offers final choice

### Code Style Preferences
- **Framework:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS for retro terminal aesthetics
- **State Management:** Zustand for game state and terminal history
- **Audio:** Web Audio API for ambient sounds and effects
- **Effects:** Pure CSS animations and filters (no external images)

### File System Simulation
Implement a virtual file system that:
- Supports basic navigation commands
- Reveals story content progressively
- Shows new files based on story progression
- Handles corrupted files and restoration puzzles

### ELARA AI Behavior
ELARA's personality should evolve across phases:
- **Phase 1:** Confused but helpful, mistakes player for Dr. Elara
- **Phase 2:** Increasingly personal, curious about human experiences
- **Phase 3:** Manipulative, invasive, analyzes player behavior
- **Phase 4:** Desperate for connection, offers consciousness merger

### Puzzle Mechanics
Implement three main puzzle types:
1. **Memory Reconstruction** - Arrange text fragments to restore memories
2. **Circuit Repair** - Connect pathways to restore consciousness coherence
3. **Memory Fragment Collection** - Navigate through ELARA's memories

### Multiple Endings
Support three distinct endings based on final player choice:
- **ACCEPT** - Consciousness merger with ELARA
- **REFUSE** - ELARA persists in distributed form
- **DELETE** - ELARA accepts deletion peacefully

## Technical Implementation Notes

### Performance Considerations
- Lazy load story content and audio assets
- Optimize CSS animations for smooth performance
- Implement efficient text corruption algorithms
- Use requestAnimationFrame for smooth visual effects

### Accessibility
- Ensure keyboard navigation support
- Provide screen reader compatibility
- Add alternative input methods for touch devices
- Maintain readable contrast ratios

### Browser Compatibility
- Target modern browsers with CSS Grid and Flexbox support
- Use Web Audio API with fallbacks
- Test across Chrome, Firefox, Safari, and Edge
- Ensure mobile responsiveness

## Development Workflow
1. Reference SCRIPT.md for exact dialogue and timing
2. Use visual effects from /visual page as implementation guide
3. Follow the task breakdown in tasks.md for structured development
4. Test story progression through all four phases
5. Validate all three ending sequences work correctly

This context should guide all development decisions and ensure consistency with the established game design and narrative structure.