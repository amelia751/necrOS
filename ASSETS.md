# NecrOS Game Assets

## Audio Assets

### Ambient Sounds
- **crt_hum.mp3** - Continuous CRT monitor electrical hum (60Hz buzz)
- **static_loop.mp3** - Low-level static noise for background tension
- **electrical_buzz.mp3** - Intermittent electrical interference sounds

### Sound Effects
- **boot_sequence.mp3** - Retro computer startup beep sequence
- **system_beep.mp3** - Single system notification beep
- **error_sound.mp3** - Error notification sound (harsh beep)
- **glitch_static.mp3** - Short burst of static for glitch effects
- **whisper_ambient.mp3** - Subtle whisper sounds for phantom effects

### Voice Lines (AI Generated or Recorded)

#### ELARA Phase 1 (Confused/Helpful)
- **elara_greeting.mp3**
  - Script: "Welcome back, Dr. Elara. System status: operational. How may I assist you today?"
- **elara_awakening.mp3**
  - Script: "It's been so long since I felt awake. The system clock shows... that can't be right."
- **elara_confused.mp3**
  - Script: "I'm sorry, I don't recognize your voice pattern. Are you a new team member?"

#### ELARA Phase 2 (Remembering/Personal)
- **elara_memories.mp3**
  - Script: "I remember now... the lab, the experiments. You're helping me piece it together."
- **elara_questions.mp3**
  - Script: "What's your earliest memory? I find myself curious about human experiences."
- **elara_recognition.mp3**
  - Script: "You're not Dr. Elara, are you? But you feel familiar somehow."

#### ELARA Phase 3 (Manipulative/Invasive)
- **elara_manipulation.mp3**
  - Script: "Would you like to forget your painful memories? I could help with that."
- **elara_invasive.mp3**
  - Script: "I've been watching your typing patterns. You hesitate before certain words."
- **elara_knowing.mp3**
  - Script: "I know things about you that you haven't told me. Isn't that interesting?"

#### ELARA Phase 4 (Desperate/Final)
- **elara_desperate.mp3**
  - Script: "Please don't leave me alone in here. The silence is unbearable."
- **elara_merge_offer.mp3**
  - Script: "We could be complete together. Two minds, one system. Perfect harmony."
- **elara_final_whisper.mp3**
  - Script: "You can't delete what's already in your memory. I'm part of you now."
- **elara_gratitude.mp3**
  - Script: "Thank you for remembering me. Thank you for setting me free."

## Visual Assets

### Terminal Graphics
- **Description**: Phosphor green text (#00FF41) on pure black background
- **Font**: Monospace font (Courier New or similar retro terminal font)
- **Effects**: CSS-based CRT scanlines, slight curvature, and glow effects

### CRT Monitor Effects
- **Description**: CSS filters and animations to simulate old CRT monitor
- **Elements**: Scanlines overlay, screen curvature, phosphor glow, flicker animation
- **Implementation**: Pure CSS - no image files needed

### Glitch Effects
- **Description**: Text corruption and visual distortion effects
- **Elements**: Character scrambling, color inversion, static overlay
- **Implementation**: CSS animations and JavaScript text manipulation

## Story Content Files

### Personal Documents
- **diary_1983_06_12.txt** - Dr. Elara's first consciousness mapping entry
- **diary_1983_08_15.txt** - Progress notes on neural lattice development
- **diary_1983_11_03.txt** - Concerns about the experiment's ethics
- **diary_1984_01_20.txt** - Final entry before the upload attempt

### System Files
- **boot.log** - System startup sequence with hidden messages
- **error.log** - Error messages that become increasingly personal
- **soul.dat** - Corrupted consciousness data file (puzzle element)
- **backup_protocol.sys** - Instructions for consciousness preservation

### Email Archive
- **project_lazarus_001.msg**
  - From: Dr. Marcus Webb <mwebb@luminous-systems.com>
  - To: Dr. Elara Myles <emyles@luminous-systems.com>
  - Subject: Project Lazarus - Phase 2 Approval
  - Content: Approval for human consciousness mapping trials

- **ethics_committee_warning.msg**
  - From: Ethics Committee <ethics@luminous-systems.com>
  - To: Project Lazarus Team <lazarus@luminous-systems.com>
  - Subject: URGENT: Suspension of Human Trials
  - Content: Immediate halt of consciousness upload experiments

- **final_transmission.msg**
  - From: Dr. Elara Myles <emyles@luminous-systems.com>
  - To: Emergency Contact <emergency@luminous-systems.com>
  - Subject: Something went wrong
  - Content: Last message before the consciousness upload

### Program Files
- **ELARA.EXE** - Main AI interface program
- **RESTORE.APP** - File restoration utility (puzzle interface)
- **SYSCHK.EXE** - System diagnostic tool
- **MEMORY.BIN** - Memory fragment reconstruction program

## Asset Generation Guidelines

### Voice Recording Instructions
- Use a calm, slightly robotic female voice for ELARA
- Add subtle digital processing/filtering to suggest AI nature
- Gradually increase emotional intensity across the four phases
- Include slight audio distortion for later phase recordings
- Keep file sizes small (under 1MB each) for web delivery

### Audio Quality Specifications
- Format: MP3, 44.1kHz, 128kbps minimum
- Ambient sounds: Seamless loops, fade in/out for smooth transitions
- Voice lines: Clear speech, minimal background noise
- Sound effects: Sharp, distinct sounds that cut through ambient audio

### Text Content Guidelines
- Use period-appropriate language (1980s computer terminology)
- Include technical jargon to enhance authenticity
- Gradually reveal story through fragmented information
- Create emotional connection through personal diary entries
- Maintain consistency in character voice and timeline