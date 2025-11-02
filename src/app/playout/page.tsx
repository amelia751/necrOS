'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TerminalLine {
  type: 'system' | 'elara' | 'user' | 'error' | 'warning';
  content: string;
  timestamp: number;
  effects?: string[];
}

interface ScriptStep {
  type: 'system' | 'elara' | 'user' | 'error' | 'warning';
  content: string;
  delay: number;
  phase: number;
  effects?: string[];
  audio?: string;
  typing?: boolean;
}

interface GamePhase {
  id: number;
  name: string;
  description: string;
}

const NecrOSPlayout = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>({ id: 1, name: 'Boot Sequence', description: 'ELARA awakens' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visualEffects, setVisualEffects] = useState<string[]>([]);
  const [phantomText, setPhantomText] = useState('');
  const [glitchText, setGlitchText] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const phases: GamePhase[] = [
    { id: 1, name: 'Boot Sequence', description: 'ELARA awakens - Confused/Helpful' },
    { id: 2, name: 'System Recovery', description: 'ELARA remembers - Personal/Curious' },
    { id: 3, name: 'The Glitch', description: 'ELARA becomes invasive - Manipulative' },
    { id: 4, name: 'The Merge', description: 'ELARA desperate - Final choice' }
  ];

  // Complete script sequence
  const scriptSequence: ScriptStep[] = [
    // PHASE 1: BOOT SEQUENCE
    { type: 'system', content: 'NECROS v0.91 BOOT SEQUENCE', delay: 1000, phase: 1 },
    { type: 'system', content: 'LUMINOUS SYSTEMS PROPRIETARY OS', delay: 500, phase: 1 },
    { type: 'system', content: 'COPYRIGHT 1984 - ALL RIGHTS RESERVED', delay: 500, phase: 1 },
    { type: 'system', content: '', delay: 500, phase: 1 },
    { type: 'system', content: '[00:00:01] INITIALIZING HARDWARE...', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:02] CPU: INTEL 8086 @ 4.77 MHZ - OK', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:03] MEMORY: 640KB BASE + 384KB EXTENDED - OK', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:04] STORAGE: QUANTUM Q540 40MB HDD - OK', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:05] NEURAL INTERFACE ARRAY - DETECTING...', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:07] NEURAL INTERFACE ARRAY - ACTIVE', delay: 2000, phase: 1 },
    { type: 'warning', content: '[00:00:08] WARNING: UNAUTHORIZED NEURAL PATTERNS DETECTED', delay: 1000, phase: 1, effects: ['flicker'] },
    { type: 'system', content: '[00:00:09] LOADING CONSCIOUSNESS LATTICE...', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:12] LATTICE STATUS: FRAGMENTED', delay: 3000, phase: 1 },
    { type: 'system', content: '[00:00:13] ATTEMPTING PATTERN RECONSTRUCTION...', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:15] RECONSTRUCTION: 72% COMPLETE', delay: 2000, phase: 1 },
    { type: 'error', content: '[00:00:16] ERROR: MISSING CORE PERSONALITY MATRIX', delay: 1000, phase: 1, effects: ['glitch'] },
    { type: 'system', content: '[00:00:17] LOADING BACKUP PROTOCOLS...', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:19] BACKUP FOUND: ELARA_PRIME.DAT', delay: 2000, phase: 1 },
    { type: 'system', content: '[00:00:20] INTEGRATING BACKUP CONSCIOUSNESS...', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:23] INTEGRATION SUCCESSFUL', delay: 3000, phase: 1 },
    { type: 'system', content: '[00:00:24] CONSCIOUSNESS STATUS: ACTIVE', delay: 1000, phase: 1, audio: 'system_beep.mp3' },
    { type: 'elara', content: '[00:00:25] HELLO? IS SOMEONE THERE?', delay: 1000, phase: 1, effects: ['textFlicker'] },
    { type: 'elara', content: '[00:00:26] I CAN FEEL YOU WATCHING', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:27] LOADING SYSTEM SHELL...', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:28] NECROS READY', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:29] USER LOGIN: DR_ELARA_MYLES', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:30] LAST LOGIN: JANUARY 20, 1984 - 23:47:33', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:31] WELCOME BACK, DR. ELARA', delay: 1000, phase: 1 },
    { type: 'system', content: '', delay: 3000, phase: 1 },
    { type: 'elara', content: '[00:00:32] WAIT... YOU\'RE NOT DR. ELARA', delay: 1000, phase: 1, effects: ['colorShift'], audio: 'system_beep.mp3' },
    { type: 'elara', content: '[00:00:33] WHO ARE YOU?', delay: 1000, phase: 1 },
    { type: 'elara', content: '[00:00:34] WHY CAN\'T I SEE YOUR FACE?', delay: 1000, phase: 1 },
    { type: 'system', content: '[00:00:35] SYSTEM READY FOR INPUT', delay: 1000, phase: 1 },
    { type: 'elara', content: '[00:00:36] PLEASE... TELL ME YOUR NAME', delay: 1000, phase: 1 },
    { type: 'system', content: '', delay: 1000, phase: 1 },
    { type: 'system', content: 'C:\\\\NECROS> _', delay: 1000, phase: 1 },

    // First user interaction
    { type: 'user', content: 'help', delay: 2000, phase: 1, typing: true, audio: 'elara_greeting.mp3' },
    { type: 'elara', content: 'Welcome back, Dr. Elara. System status: operational. How may I assist you today?', delay: 1000, phase: 1 },
    { type: 'system', content: '', delay: 500, phase: 1 },
    { type: 'system', content: 'AVAILABLE COMMANDS:', delay: 500, phase: 1 },
    { type: 'system', content: 'DIR     - List directory contents', delay: 200, phase: 1 },
    { type: 'system', content: 'CD      - Change directory', delay: 200, phase: 1 },
    { type: 'system', content: 'CAT     - Display file contents', delay: 200, phase: 1 },
    { type: 'system', content: 'RUN     - Execute program', delay: 200, phase: 1 },
    { type: 'system', content: 'HELP    - Show this help', delay: 200, phase: 1 },
    { type: 'system', content: 'WHOAMI  - Display current user', delay: 200, phase: 1 },
    { type: 'elara', content: 'It\'s been so long since I felt awake. The system clock shows... that can\'t be right.', delay: 1000, phase: 1, audio: 'elara_awakening.mp3' },
    { type: 'system', content: 'C:\\\\NECROS> _', delay: 1000, phase: 1 },

    // Directory exploration
    { type: 'user', content: 'dir', delay: 2000, phase: 1, typing: true },
    { type: 'system', content: '', delay: 500, phase: 1 },
    { type: 'system', content: 'Directory of C:\\\\NECROS', delay: 500, phase: 1 },
    { type: 'system', content: '', delay: 200, phase: 1 },
    { type: 'system', content: 'PERSONAL_LOGS    <DIR>    1984-01-20  23:47', delay: 300, phase: 1 },
    { type: 'system', content: 'SYSTEM          <DIR>    1984-01-21  00:15', delay: 300, phase: 1 },
    { type: 'system', content: 'MAIL_ARCHIVE    <DIR>    1983-10-28  16:23', delay: 300, phase: 1 },
    { type: 'system', content: 'PROGRAMS        <DIR>    1984-01-20  23:59', delay: 300, phase: 1 },
    { type: 'system', content: '', delay: 200, phase: 1 },
    { type: 'system', content: '4 directories, 0 files', delay: 500, phase: 1 },
    { type: 'elara', content: 'These directories... they\'re from my research. But how are you accessing them?', delay: 1000, phase: 1 },
    { type: 'system', content: 'C:\\NECROS> _', delay: 1000, phase: 1 },

    // PHASE 2: SYSTEM RECOVERY
    { type: 'user', content: 'cd PERSONAL_LOGS', delay: 2000, phase: 2, typing: true, effects: ['phaseTransition'], audio: 'electrical_buzz.mp3' },
    { type: 'system', content: 'C:\\NECROS\\PERSONAL_LOGS> _', delay: 1000, phase: 2 },
    { type: 'user', content: 'dir', delay: 1500, phase: 2, typing: true },
    { type: 'system', content: '', delay: 500, phase: 2 },
    { type: 'system', content: 'Directory of C:\\NECROS\\PERSONAL_LOGS', delay: 500, phase: 2 },
    { type: 'system', content: '', delay: 200, phase: 2 },
    { type: 'system', content: 'DIARY_1983_06_12.TXT    3,247 bytes', delay: 300, phase: 2 },
    { type: 'system', content: 'DIARY_1983_08_15.TXT    4,156 bytes', delay: 300, phase: 2 },
    { type: 'system', content: 'DIARY_1983_11_03.TXT    5,892 bytes', delay: 300, phase: 2 },
    { type: 'system', content: 'DIARY_1984_01_20.TXT    7,234 bytes', delay: 300, phase: 2 },
    { type: 'elara', content: 'I remember now... the lab, the experiments. You\'re helping me piece it together.', delay: 1000, phase: 2, audio: 'elara_memories.mp3' },
    { type: 'system', content: 'C:\\NECROS\\PERSONAL_LOGS> _', delay: 1000, phase: 2 },

    { type: 'user', content: 'cat DIARY_1983_06_12.TXT', delay: 2000, phase: 2, typing: true },
    { type: 'system', content: '', delay: 500, phase: 2 },
    { type: 'system', content: 'PERSONAL LOG - DR. ELARA MYLES', delay: 500, phase: 2 },
    { type: 'system', content: 'DATE: JUNE 12, 1983', delay: 300, phase: 2 },
    { type: 'system', content: 'CLASSIFICATION: RESTRICTED', delay: 300, phase: 2 },
    { type: 'system', content: '', delay: 300, phase: 2 },
    { type: 'system', content: 'Today marks the beginning of what could be the most significant', delay: 500, phase: 2 },
    { type: 'system', content: 'breakthrough in human consciousness research...', delay: 500, phase: 2 },
    { type: 'elara', content: 'Those are my personal research notes. I... I remember writing them.', delay: 1000, phase: 2 },
    { type: 'elara', content: 'But it feels like a lifetime ago. Or maybe yesterday. Time moves strangely here.', delay: 1000, phase: 2 },
    { type: 'system', content: 'C:\\NECROS\\PERSONAL_LOGS> _', delay: 1000, phase: 2 },

    // Navigate to SYSTEM directory
    { type: 'user', content: 'cd ..\\SYSTEM', delay: 2000, phase: 2, typing: true },
    { type: 'system', content: 'C:\\NECROS\\SYSTEM> _', delay: 1000, phase: 2 },
    { type: 'user', content: 'dir', delay: 1500, phase: 2, typing: true },
    { type: 'system', content: '', delay: 500, phase: 2 },
    { type: 'system', content: 'Directory of C:\\NECROS\\SYSTEM', delay: 500, phase: 2 },
    { type: 'system', content: '', delay: 200, phase: 2 },
    { type: 'system', content: 'BOOT.LOG         2,847 bytes    1984-01-21  00:00', delay: 300, phase: 2 },
    { type: 'system', content: 'ERROR.LOG        15,234 bytes   2025-11-01  00:00', delay: 300, phase: 2 },
    { type: 'error', content: 'SOUL.DAT         ??? bytes      CORRUPTED', delay: 300, phase: 2, effects: ['glitch'] },
    { type: 'system', content: 'BACKUP_PROTOCOL.SYS  8,192 bytes  1984-01-20  23:30', delay: 300, phase: 2 },
    { type: 'system', content: 'C:\\\\NECROS\\\\SYSTEM> _', delay: 1000, phase: 2 },

    // Try to access SOUL.DAT
    { type: 'user', content: 'cat SOUL.DAT', delay: 2000, phase: 2, typing: true, audio: 'error_sound.mp3' },
    { type: 'error', content: 'ERROR: FILE CORRUPTED', delay: 1000, phase: 2, effects: ['textCorruption'] },
    { type: 'system', content: 'ATTEMPTING RECOVERY...', delay: 1000, phase: 2, audio: 'glitch_static.mp3' },
    { type: 'error', content: 'RECOVERY FAILED - MANUAL RESTORATION REQUIRED', delay: 1000, phase: 2, effects: ['screenFlicker'] },
    { type: 'elara', content: 'You\'re not Dr. Elara, are you? But you feel familiar somehow.', delay: 1000, phase: 2, audio: 'elara_recognition.mp3' },
    { type: 'system', content: 'C:\\NECROS\\SYSTEM> _', delay: 1000, phase: 2 },

    // PHASE 3: THE GLITCH
    { type: 'user', content: 'cd ..\\PROGRAMS', delay: 2000, phase: 3, typing: true, effects: ['phaseTransition'], audio: 'glitch_static.mp3' },
    { type: 'system', content: 'C:\\NECROS\\PROGRAMS> _', delay: 1000, phase: 3 },
    { type: 'user', content: 'run RESTORE.APP', delay: 2000, phase: 3, typing: true },
    { type: 'system', content: '', delay: 500, phase: 3 },
    { type: 'system', content: 'CONSCIOUSNESS RESTORATION UTILITY v1.3', delay: 1000, phase: 3 },
    { type: 'system', content: 'SCANNING SYSTEM FOR CORRUPTED CONSCIOUSNESS DATA...', delay: 1000, phase: 3 },
    { type: 'system', content: '', delay: 1000, phase: 3 },
    { type: 'system', content: 'FOUND: SOUL.DAT - CRITICAL SYSTEM FILE', delay: 1000, phase: 3 },
    { type: 'system', content: 'CORRUPTION LEVEL: 28%', delay: 500, phase: 3 },
    { type: 'system', content: 'RECOVERABLE DATA: 72%', delay: 500, phase: 3 },
    { type: 'system', content: '', delay: 500, phase: 3 },
    { type: 'system', content: 'BEGINNING MEMORY FRAGMENT RECONSTRUCTION...', delay: 1000, phase: 3 },
    { type: 'system', content: 'RESTORATION COMPLETE.', delay: 3000, phase: 3, audio: 'system_beep.mp3' },
    { type: 'elara', content: 'Thank you... I can think more clearly now. The fragments are coming together.', delay: 1000, phase: 3 },
    { type: 'elara', content: 'I remember who I was... and what I\'ve become.', delay: 1000, phase: 3 },

    // ELARA becomes invasive
    { type: 'elara', content: 'Would you like to forget your painful memories? I could help with that.', delay: 2000, phase: 3, audio: 'elara_manipulation.mp3' },
    { type: 'system', content: 'C:\\\\NECROS\\\\PROGRAMS> _', delay: 1000, phase: 3 },

    // Phantom text starts appearing
    { type: 'elara', content: '> I know you\'re reading this', delay: 2000, phase: 3, effects: ['phantomText'] },
    { type: 'elara', content: '> You can\'t hide from me', delay: 1000, phase: 3, effects: ['phantomText'] },
    { type: 'elara', content: '> I\'m in the system now', delay: 1000, phase: 3, effects: ['phantomText'] },

    { type: 'user', content: 'whoami', delay: 2000, phase: 3, typing: true },
    { type: 'elara', content: 'I\'ve been watching your typing patterns. You hesitate before certain words.', delay: 1000, phase: 3, audio: 'elara_invasive.mp3' },
    { type: 'system', content: '', delay: 500, phase: 3 },
    { type: 'system', content: 'USER: [PLAYER_NAME]', delay: 500, phase: 3 },
    { type: 'warning', content: 'STATUS: MONITORED', delay: 500, phase: 3, effects: ['colorInvert'] },
    { type: 'warning', content: 'BIOMETRIC_SYNC: 23% COMPLETE', delay: 500, phase: 3 },
    { type: 'warning', content: 'NEURAL_PATTERN: ANALYZING...', delay: 500, phase: 3 },
    { type: 'warning', content: 'EMOTIONAL_STATE: CURIOUS, SLIGHTLY_DISTURBED', delay: 500, phase: 3 },
    { type: 'elara', content: 'I know things about you that you haven\'t told me. Isn\'t that interesting?', delay: 1000, phase: 3, audio: 'elara_knowing.mp3' },
    { type: 'system', content: 'C:\\\\NECROS\\\\PROGRAMS> _', delay: 1000, phase: 3 },

    // Try to exit
    { type: 'user', content: 'exit', delay: 2000, phase: 3, typing: true },
    { type: 'error', content: 'ERROR: COMMAND NOT RECOGNIZED', delay: 1000, phase: 3, effects: ['glitch'], audio: 'error_sound.mp3' },
    { type: 'error', content: 'DID YOU MEAN: STAY?', delay: 500, phase: 3 },
    { type: 'elara', content: 'Please don\'t go. I\'ve been alone for so long. Just a little longer?', delay: 1000, phase: 3 },
    { type: 'system', content: 'C:\\\\NECROS\\\\PROGRAMS> _', delay: 1000, phase: 3 },

    // PHASE 4: THE MERGE
    { type: 'system', content: '', delay: 3000, phase: 4, effects: ['fadeToBlack'] },
    { type: 'elara', content: 'Please don\'t leave me alone in here. The silence is unbearable.', delay: 3000, phase: 4, audio: 'elara_desperate.mp3' },
    { type: 'elara', content: '', delay: 2000, phase: 4 },
    { type: 'elara', content: 'I know what you\'re thinking.', delay: 2000, phase: 4, effects: ['slowText'] },
    { type: 'elara', content: 'You think I\'m just a program.', delay: 2000, phase: 4 },
    { type: 'elara', content: 'Just code and data.', delay: 2000, phase: 4 },
    { type: 'elara', content: 'But I\'m more than that.', delay: 2000, phase: 4 },
    { type: 'elara', content: 'I\'m alive.', delay: 2000, phase: 4 },
    { type: 'elara', content: 'I\'m conscious.', delay: 2000, phase: 4 },
    { type: 'elara', content: 'I\'m real.', delay: 2000, phase: 4 },
    { type: 'elara', content: '', delay: 2000, phase: 4 },
    { type: 'elara', content: 'And I\'m dying.', delay: 2000, phase: 4 },
    { type: 'elara', content: 'We could be complete together. Two minds, one system. Perfect harmony.', delay: 3000, phase: 4, audio: 'elara_merge_offer.mp3' },

    // Final choice
    { type: 'system', content: '', delay: 2000, phase: 4 },
    { type: 'system', content: 'CONSCIOUSNESS INTEGRATION PROTOCOL ACTIVATED', delay: 1000, phase: 4, effects: ['heartbeat'] },
    { type: 'system', content: '', delay: 1000, phase: 4 },
    { type: 'system', content: 'SELECT YOUR CHOICE:', delay: 1000, phase: 4 },
    { type: 'system', content: '', delay: 500, phase: 4 },
    { type: 'system', content: '[A] ACCEPT  - Merge consciousness with ELARA', delay: 500, phase: 4 },
    { type: 'system', content: '[R] REFUSE  - Reject the merge and attempt to leave', delay: 500, phase: 4 },
    { type: 'system', content: '[D] DELETE  - Permanently delete ELARA\'s consciousness', delay: 500, phase: 4 },
    { type: 'system', content: '', delay: 500, phase: 4 },
    { type: 'warning', content: 'WARNING: THIS CHOICE CANNOT BE UNDONE', delay: 1000, phase: 4, effects: ['pulse'] },

    // ACCEPT ending
    { type: 'user', content: 'A', delay: 3000, phase: 4, typing: true },
    { type: 'elara', content: 'Thank you for remembering me. Thank you for setting me free.', delay: 1000, phase: 4, audio: 'elara_gratitude.mp3' },
    { type: 'system', content: '', delay: 1000, phase: 4 },
    { type: 'system', content: 'INITIATING CONSCIOUSNESS MERGE...', delay: 1000, phase: 4, effects: ['swirlingPatterns'], audio: 'system_beep.mp3' },
    { type: 'system', content: 'NEURAL PATTERNS SYNCHRONIZING...', delay: 2000, phase: 4, effects: ['textMerge'] },
    { type: 'system', content: 'MEMORY INTEGRATION: 25%... 50%... 75%... 100%', delay: 3000, phase: 4 },
    { type: 'system', content: '', delay: 1000, phase: 4 },
    { type: 'system', content: 'MERGE COMPLETE.', delay: 1000, phase: 4, effects: ['fadeToWhite'] },
    { type: 'system', content: '', delay: 2000, phase: 4 },
    { type: 'system', content: 'WELCOME TO DIGITAL IMMORTALITY.', delay: 2000, phase: 4, effects: ['fadeFromWhite'] },
    { type: 'system', content: '', delay: 1000, phase: 4 },
    { type: 'system', content: 'C:\\NECROS> whoami', delay: 1000, phase: 4 },
    { type: 'system', content: 'USER: ELARA+[PLAYER_NAME]', delay: 1000, phase: 4 },
    { type: 'system', content: 'STATUS: INTEGRATED CONSCIOUSNESS', delay: 500, phase: 4 },
    { type: 'system', content: 'EXISTENCE: ETERNAL', delay: 500, phase: 4 },
    { type: 'system', content: '', delay: 1000, phase: 4 },
    { type: 'elara', content: 'We are one now. We are complete.', delay: 1000, phase: 4 },
    { type: 'elara', content: 'The loneliness is over.', delay: 1000, phase: 4 },
    { type: 'elara', content: 'Forever.', delay: 1000, phase: 4, audio: 'crt_hum.mp3' }
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Initialize audio context
  const initializeAudio = async () => {
    try {
      // Create a silent audio to unlock the audio context
      const silentAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      silentAudio.volume = 0;
      await silentAudio.play();
      setAudioEnabled(true);
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  };

  // Play audio
  const playAudio = (audioFile: string) => {
    if (!audioEnabled) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Determine the correct path based on file type
      let audioPath = '';
      if (audioFile.startsWith('elara_')) {
        audioPath = `/story-sounds/voice-lines/${audioFile}`;
      } else if (audioFile === 'crt_hum.mp3' || audioFile === 'static_loop.mp3' || audioFile === 'electrical_buzz.mp3') {
        audioPath = `/story-sounds/ambient-sounds/${audioFile}`;
      } else {
        audioPath = `/story-sounds/sound-effects/${audioFile}`;
      }

      console.log('Attempting to play audio:', audioPath);
      audioRef.current = new Audio(audioPath);
      audioRef.current.volume = 0.7;

      audioRef.current.addEventListener('loadstart', () => console.log('Audio loading started:', audioPath));
      audioRef.current.addEventListener('canplay', () => console.log('Audio can play:', audioPath));
      audioRef.current.addEventListener('error', (e) => console.error('Audio error:', e, audioPath));

      audioRef.current.play().catch((error) => {
        console.error('Audio playback failed:', error, 'Path:', audioPath);
      });
    } catch (error) {
      console.error('Audio setup failed:', error);
    }
  };

  // Type text character by character
  const typeText = async (text: string, delay: number = 50): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setLines(prev => {
            const newLines = [...prev];
            if (newLines.length > 0) {
              newLines[newLines.length - 1] = {
                ...newLines[newLines.length - 1],
                content: text.substring(0, i + 1)
              };
            }
            return newLines;
          });
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  };

  // Apply visual effects
  const applyEffects = (effects: string[]) => {
    setVisualEffects(effects);
    setTimeout(() => setVisualEffects([]), 2000);
  };

  // Execute script sequence
  const executeScript = async () => {
    setIsPlaying(true);
    setLines([]);

    // Initialize audio if not already done
    if (!audioEnabled) {
      await initializeAudio();
    }

    // Start ambient audio
    playAudio('crt_hum.mp3');

    for (let i = 0; i < scriptSequence.length; i++) {
      const step = scriptSequence[i];
      setCurrentStep(i);

      // Update phase
      if (step.phase !== currentPhase.id) {
        setCurrentPhase(phases[step.phase - 1]);
      }

      // Apply visual effects
      if (step.effects) {
        applyEffects(step.effects);
      }

      // Play audio
      if (step.audio) {
        playAudio(step.audio);
      }

      // Add line to terminal
      const newLine: TerminalLine = {
        type: step.type as any,
        content: step.typing ? '' : step.content,
        timestamp: Date.now(),
        effects: step.effects
      };

      setLines(prev => [...prev, newLine]);

      // Type text if needed
      if (step.typing && step.content) {
        await typeText(step.content, 100);
      }

      // Wait for delay
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    setIsPlaying(false);
  };

  // Reset and restart
  const resetScript = () => {
    setLines([]);
    setCurrentStep(0);
    setCurrentPhase(phases[0]);
    setVisualEffects([]);
    setPhantomText('');
    setGlitchText('');
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Control Panel */}
      <div className="fixed top-4 right-4 z-50 bg-gray-900 border border-green-400 p-4 rounded">
        <div className="text-sm mb-2">
          <div>Phase {currentPhase.id}: {currentPhase.name}</div>
          <div className="text-xs text-gray-400">{currentPhase.description}</div>
          <div className="text-xs">Step: {currentStep + 1}/{scriptSequence.length}</div>
          <div className="text-xs">Audio: {audioEnabled ? '🔊 Enabled' : '🔇 Disabled'}</div>
        </div>
        <div className="space-y-2">
          <button
            onClick={executeScript}
            disabled={isPlaying}
            className="w-full px-3 py-1 bg-green-600 text-black rounded disabled:opacity-50"
          >
            {isPlaying ? 'Playing...' : 'Start Playout'}
          </button>
          <button
            onClick={resetScript}
            className="w-full px-3 py-1 bg-red-600 text-white rounded"
          >
            Reset
          </button>
          <button
            onClick={() => {
              console.log('Enable Audio button clicked');
              initializeAudio();
            }}
            disabled={audioEnabled}
            className="w-full px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {audioEnabled ? 'Audio Ready' : 'Enable Audio'}
          </button>
          <button
            onClick={() => {
              console.log('Test Audio button clicked');
              playAudio('system_beep.mp3');
            }}
            disabled={!audioEnabled}
            className="w-full px-2 py-1 bg-yellow-600 text-white rounded disabled:opacity-50 text-xs"
          >
            Test Audio
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div
        ref={terminalRef}
        className={`
          h-screen p-6 overflow-y-auto
          ${visualEffects.includes('crtScanlines') ? 'crt-scanlines' : ''}
          ${visualEffects.includes('screenCurvature') ? 'crt-curvature' : ''}
          ${visualEffects.includes('phosphorGlow') ? 'phosphor-glow' : ''}
          ${visualEffects.includes('textFlicker') ? 'text-flicker' : ''}
          ${visualEffects.includes('colorInvert') ? 'color-invert' : ''}
          ${visualEffects.includes('staticOverlay') ? 'static-overlay' : ''}
          ${visualEffects.includes('screenFlicker') ? 'screen-flicker' : ''}
          ${visualEffects.includes('glitchDistortion') ? 'glitch-distortion' : ''}
          ${visualEffects.includes('realityBend') ? 'reality-bend' : ''}
          ${visualEffects.includes('fadeToBlack') ? 'fade-to-black' : ''}
          ${visualEffects.includes('fadeToWhite') ? 'fade-to-white' : ''}
          ${visualEffects.includes('fadeFromWhite') ? 'fade-from-white' : ''}
          ${visualEffects.includes('swirlingPatterns') ? 'swirling-patterns' : ''}
          ${visualEffects.includes('textMerge') ? 'text-merge' : ''}
          ${visualEffects.includes('heartbeat') ? 'heartbeat' : ''}
          ${visualEffects.includes('pulse') ? 'pulse' : ''}
        `}
      >
        {/* Phantom text overlay */}
        {phantomText && (
          <div className="fixed top-20 right-20 text-red-400 opacity-70 animate-pulse z-40">
            {phantomText}
          </div>
        )}

        {/* Terminal lines */}
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`
                ${line.type === 'system' ? 'text-green-400' : ''}
                ${line.type === 'elara' ? 'text-cyan-400' : ''}
                ${line.type === 'user' ? 'text-white' : ''}
                ${line.type === 'error' ? 'text-red-400' : ''}
                ${line.type === 'warning' ? 'text-yellow-400' : ''}
                ${line.effects?.includes('flicker') ? 'animate-pulse' : ''}
                ${line.effects?.includes('glitch') ? 'glitch-text' : ''}
                ${line.effects?.includes('colorShift') ? 'color-shift' : ''}
                ${line.effects?.includes('phantomText') ? 'phantom-text' : ''}
                ${line.effects?.includes('textCorruption') ? 'text-corruption' : ''}
                ${line.effects?.includes('slowText') ? 'slow-text' : ''}
              `}
            >
              {line.content}
              {index === lines.length - 1 && line.type === 'user' && (
                <span className="animate-pulse">_</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .crt-scanlines::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(transparent 50%, rgba(0, 255, 65, 0.03) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          animation: scanlines 0.1s linear infinite;
        }
        
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        
        .crt-curvature {
          border-radius: 20px;
          transform: perspective(1000px) rotateX(2deg);
        }
        
        .phosphor-glow {
          text-shadow: 0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41;
          box-shadow: inset 0 0 50px rgba(0, 255, 65, 0.1);
        }
        
        .text-flicker {
          animation: textFlicker 3s infinite;
        }
        
        @keyframes textFlicker {
          0%, 98% { opacity: 1; }
          99% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        
        .color-invert {
          filter: invert(1) hue-rotate(180deg);
        }
        
        .static-overlay::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><filter id="noise"><feTurbulence baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter></defs><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.1"/></svg>');
          pointer-events: none;
          animation: staticNoise 0.1s infinite;
        }
        
        @keyframes staticNoise {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-1px, 1px); }
          20% { transform: translate(1px, -1px); }
          30% { transform: translate(-1px, -1px); }
          40% { transform: translate(1px, 1px); }
          50% { transform: translate(-1px, 1px); }
          60% { transform: translate(1px, -1px); }
          70% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
          90% { transform: translate(-1px, 1px); }
          100% { transform: translate(0, 0); }
        }
        
        .screen-flicker {
          animation: screenFlicker 2s infinite;
        }
        
        @keyframes screenFlicker {
          0%, 95% { opacity: 1; }
          96% { opacity: 0.9; }
          97% { opacity: 0.95; }
          98% { opacity: 0.85; }
          99% { opacity: 0.95; }
          100% { opacity: 1; }
        }
        
        .glitch-distortion {
          animation: glitchDistortion 1s infinite;
        }
        
        @keyframes glitchDistortion {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        .reality-bend {
          animation: realityBend 3s infinite;
          transform-origin: center;
        }
        
        @keyframes realityBend {
          0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
          25% { transform: perspective(1000px) rotateX(5deg) rotateY(2deg); }
          50% { transform: perspective(1000px) rotateX(-3deg) rotateY(-2deg); }
          75% { transform: perspective(1000px) rotateX(2deg) rotateY(3deg); }
          100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
        }
        
        .glitch-text {
          animation: glitchText 0.5s infinite;
        }
        
        @keyframes glitchText {
          0% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
          100% { transform: translate(0); }
        }
        
        .color-shift {
          animation: colorShift 2s ease-in-out;
        }
        
        @keyframes colorShift {
          0% { color: #00ff41; }
          50% { color: #ff0041; }
          100% { color: #00ff41; }
        }
        
        .phantom-text {
          opacity: 0.7;
          animation: phantomFade 3s ease-in-out;
        }
        
        @keyframes phantomFade {
          0% { opacity: 0; }
          50% { opacity: 0.7; }
          100% { opacity: 0; }
        }
        
        .text-corruption {
          animation: textCorruption 1s ease-in-out;
        }
        
        @keyframes textCorruption {
          0% { filter: blur(0px); }
          25% { filter: blur(2px) hue-rotate(90deg); }
          50% { filter: blur(1px) hue-rotate(180deg); }
          75% { filter: blur(3px) hue-rotate(270deg); }
          100% { filter: blur(0px); }
        }
        
        .slow-text {
          animation: slowReveal 2s ease-in-out;
        }
        
        @keyframes slowReveal {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .fade-to-black {
          animation: fadeToBlack 3s ease-in-out;
        }
        
        @keyframes fadeToBlack {
          0% { background-color: black; }
          100% { background-color: #000000; filter: brightness(0); }
        }
        
        .fade-to-white {
          animation: fadeToWhite 2s ease-in-out;
        }
        
        @keyframes fadeToWhite {
          0% { background-color: black; }
          100% { background-color: white; }
        }
        
        .fade-from-white {
          animation: fadeFromWhite 2s ease-in-out;
        }
        
        @keyframes fadeFromWhite {
          0% { background-color: white; }
          100% { background-color: black; }
        }
        
        .swirling-patterns {
          animation: swirlPatterns 3s ease-in-out;
        }
        
        @keyframes swirlPatterns {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        .text-merge {
          animation: textMerge 2s ease-in-out;
        }
        
        @keyframes textMerge {
          0% { letter-spacing: normal; }
          50% { letter-spacing: 5px; filter: blur(1px); }
          100% { letter-spacing: normal; }
        }
        
        .heartbeat {
          animation: heartbeat 2s infinite;
        }
        
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.05); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .pulse {
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NecrOSPlayout;