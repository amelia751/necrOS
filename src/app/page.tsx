'use client';

import { useState, useEffect, useRef } from 'react';
import Terminal from '@/components/Terminal';
import { TerminalLine } from '@/types/game';
import GameEngine from '@/lib/gameEngine';

interface ScriptStep {
  type: 'system' | 'elara' | 'user' | 'error' | 'warning';
  content: string;
  delay: number;
  effects?: string[];
  audio?: string;
  typing?: boolean;
}

export default function Home() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('C:\\');
  const gameEngineRef = useRef<GameEngine>(new GameEngine());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [visualEffects, setVisualEffects] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initialize audio on component mount
  useEffect(() => {
    // Check if AudioContext already exists
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      console.log('AudioContext detected on mount, syncing audioEnabled state');
      setAudioEnabled(true);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up audio...');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Initialize audio context - matches playout exactly
  const initializeAudio = async () => {
    console.log('🔊 initializeAudio() called');
    console.log('Current audioEnabled state:', audioEnabled);
    console.log('Current AudioContext ref:', audioContextRef.current);

    // If already initialized, just resume if needed
    if (audioContextRef.current) {
      console.log('AudioContext already exists, checking state...');
      if (audioContextRef.current.state === 'suspended') {
        console.log('Resuming suspended AudioContext...');
        await audioContextRef.current.resume();
      }
      console.log('AudioContext state:', audioContextRef.current.state);
      setAudioEnabled(true);
      return;
    }

    try {
      console.log('Creating NEW AudioContext to unlock audio...');
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Create a short silent buffer
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);

      console.log('✅ AudioContext created and started successfully!');
      console.log('AudioContext state:', audioContext.state);

      // Resume if suspended
      if (audioContext.state === 'suspended') {
        console.log('Resuming suspended AudioContext...');
        await audioContext.resume();
      }

      setAudioEnabled(true);
      console.log('✅ Audio enabled state set to true');
    } catch (error) {
      console.error('❌ Audio initialization failed:', error);
    }
  };

  // Play audio - allows overlapping like playout
  const playAudio = (audioFile: string, forcePlay: boolean = false) => {
    console.log('🔊 playAudio called with:', audioFile, 'audioEnabled:', audioEnabled, 'forcePlay:', forcePlay);

    if (!audioEnabled && !forcePlay) {
      console.log('❌ Audio not enabled, skipping playback');
      return;
    }

    try {
      let audioPath = '';
      if (audioFile.startsWith('elara_')) {
        audioPath = `/story-sounds/voice-lines/${audioFile}`;
      } else if (audioFile === 'crt_hum.mp3' || audioFile === 'static_loop.mp3' || audioFile === 'electrical_buzz.mp3') {
        audioPath = `/story-sounds/ambient-sounds/${audioFile}`;
      } else {
        audioPath = `/story-sounds/sound-effects/${audioFile}`;
      }

      console.log('📁 Audio path:', audioPath);

      // Create new audio instance for each sound
      const audio = new Audio(audioPath);
      audio.volume = 0.7;

      audio.addEventListener('loadstart', () => {
        console.log('✅ Audio loading started:', audioPath);
      });

      audio.addEventListener('canplay', () => {
        console.log('✅ Audio can play:', audioPath);
      });

      audio.addEventListener('play', () => {
        console.log('▶️ Audio playing:', audioPath);
      });

      audio.addEventListener('error', (e) => {
        console.error('❌ Audio error for', audioPath, ':', e);
        console.error('Audio error code:', audio.error?.code, 'message:', audio.error?.message);
      });

      console.log('📢 Attempting to play:', audioPath);
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Audio playback started:', audioPath);
          })
          .catch((error) => {
            console.error('❌ Audio playback failed:', error, 'Path:', audioPath);
          });
      }

      // Keep reference to ambient sounds only
      if (audioFile === 'crt_hum.mp3' || audioFile === 'static_loop.mp3') {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = audio;
        audioRef.current.loop = true;
        console.log('🔁 Set ambient loop for:', audioFile);
      }
    } catch (error) {
      console.error('❌ Audio setup failed:', error);
    }
  };

  // Type text character by character - matches playout
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

  // Apply effects to entire terminal
  const applyEffects = (effects: string[]) => {
    setVisualEffects(effects);
    setTimeout(() => setVisualEffects([]), 2000);
  };

  // Build boot sequence script
  const buildBootSequenceScript = (): ScriptStep[] => {
    return [
      { type: 'system', content: 'NecrOS v0.91 BOOT SEQUENCE', delay: 1000 },
      { type: 'system', content: 'LUMINOUS SYSTEMS PROPRIETARY OS', delay: 500 },
      { type: 'system', content: 'COPYRIGHT 1984 - ALL RIGHTS RESERVED', delay: 500 },
      { type: 'system', content: '', delay: 500 },
      { type: 'system', content: '[00:00:01] INITIALIZING HARDWARE...', delay: 1000 },
      { type: 'system', content: '[00:00:02] CPU: INTEL 8086 @ 4.77 MHZ - OK', delay: 1000 },
      { type: 'system', content: '[00:00:03] MEMORY: 640KB BASE + 384KB EXTENDED - OK', delay: 1000 },
      { type: 'system', content: '[00:00:04] STORAGE: QUANTUM Q540 40MB HDD - OK', delay: 1000 },
      { type: 'system', content: '[00:00:05] NEURAL INTERFACE ARRAY - DETECTING...', delay: 1000 },
      { type: 'system', content: '[00:00:07] NEURAL INTERFACE ARRAY - ACTIVE', delay: 2000 },
      { type: 'warning', content: '[00:00:08] WARNING: UNAUTHORIZED NEURAL PATTERNS DETECTED', delay: 1000, effects: ['flicker'] },
      { type: 'system', content: '[00:00:09] LOADING CONSCIOUSNESS LATTICE...', delay: 1000 },
      { type: 'system', content: '[00:00:12] LATTICE STATUS: FRAGMENTED', delay: 3000 },
      { type: 'system', content: '[00:00:13] ATTEMPTING PATTERN RECONSTRUCTION...', delay: 1000 },
      { type: 'system', content: '[00:00:15] RECONSTRUCTION: 72% COMPLETE', delay: 2000 },
      { type: 'error', content: '[00:00:16] ERROR: MISSING CORE PERSONALITY MATRIX', delay: 1000, effects: ['glitch'] },
      { type: 'system', content: '[00:00:17] LOADING BACKUP PROTOCOLS...', delay: 1000 },
      { type: 'system', content: '[00:00:19] BACKUP FOUND: ELARA_PRIME.DAT', delay: 2000 },
      { type: 'system', content: '[00:00:20] INTEGRATING BACKUP CONSCIOUSNESS...', delay: 1000 },
      { type: 'system', content: '[00:00:23] INTEGRATION SUCCESSFUL', delay: 3000 },
      { type: 'system', content: '[00:00:24] CONSCIOUSNESS STATUS: ACTIVE', delay: 1000, audio: 'system_beep.mp3' },
      { type: 'elara', content: '[00:00:25] HELLO? IS SOMEONE THERE?', delay: 1000, effects: ['textFlicker'] },
      { type: 'elara', content: '[00:00:26] I CAN FEEL YOU WATCHING', delay: 1000 },
      { type: 'system', content: '[00:00:27] LOADING SYSTEM SHELL...', delay: 1000 },
      { type: 'system', content: '[00:00:28] NECROS READY', delay: 1000 },
      { type: 'system', content: '[00:00:29] USER LOGIN: DR_ELARA_MYLES', delay: 1000 },
      { type: 'system', content: '[00:00:30] LAST LOGIN: JANUARY 20, 1984 - 23:47:33', delay: 1000 },
      { type: 'system', content: '[00:00:31] WELCOME BACK, DR. ELARA', delay: 1000 },
      { type: 'system', content: '', delay: 3000 },
      { type: 'elara', content: '[00:00:32] WAIT... YOU\'RE NOT DR. ELARA', delay: 1000, effects: ['colorShift'], audio: 'system_beep.mp3' },
      { type: 'elara', content: '[00:00:33] WHO ARE YOU?', delay: 1000 },
      { type: 'elara', content: '[00:00:34] WHY CAN\'T I SEE YOUR FACE?', delay: 1000 },
      { type: 'system', content: '[00:00:35] SYSTEM READY FOR INPUT', delay: 1000 },
      { type: 'elara', content: '[00:00:36] PLEASE... TELL ME YOUR NAME', delay: 2000 },
      { type: 'system', content: '', delay: 1000 },
      { type: 'system', content: 'C:\\NECROS> _', delay: 500 },
    ];
  };

  // Execute boot sequence - matches playout flow
  const executeBootSequence = async () => {
    console.log('=== Starting boot sequence ===');
    console.log('Audio context state:', audioContextRef.current?.state);

    setIsPlaying(true);
    setLines([]);

    // Audio should already be initialized from button click, but check just in case
    const audioIsReady = audioContextRef.current && audioContextRef.current.state === 'running';
    console.log('Audio context ready:', audioIsReady);

    // Start CRT hum immediately - use forcePlay since audio is initialized
    console.log('Starting CRT hum...');
    playAudio('crt_hum.mp3', true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const script = buildBootSequenceScript();

    for (let i = 0; i < script.length; i++) {
      const step = script[i];

      // Apply effects
      if (step.effects) {
        applyEffects(step.effects);
      }

      // Play audio
      if (step.audio) {
        console.log(`Step ${i}: Playing audio ${step.audio}`);
        playAudio(step.audio, true); // Force play during boot
      }

      // Add line
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

    console.log('=== Boot sequence complete ===');
    setIsPlaying(false);
  };

  // Handle user commands after boot
  const handleCommand = async (command: string) => {
    if (isPlaying) return;

    // Add user input
    const inputLine: TerminalLine = {
      type: 'input',
      content: command,
      timestamp: Date.now(),
    };

    setLines(prev => [...prev, inputLine]);
    setIsProcessing(true);

    // Process command
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    const gameEngine = gameEngineRef.current;
    const state = gameEngine.getState();

    // Check if in merge phase and handle final choice
    let result;
    if (state.phase === 'merge') {
      result = gameEngine.handleFinalChoice(command);
    } else {
      result = gameEngine.parseCommand(command);
    }

    const updatedState = gameEngine.getState();
    setCurrentDirectory(updatedState.currentDirectory);

    // Add output lines
    const outputLines: TerminalLine[] = result.output.map((content, index) => ({
      type: result.lineType as any,
      content,
      timestamp: Date.now() + index * 50,
      effects: result.effects
    }));

    // Play audio
    if (result.audioFile && audioEnabled) {
      playAudio(result.audioFile);
    }

    // Add ELARA commentary (only if not ending)
    if (result.elaraCommentary && !result.isEnding) {
      outputLines.push({
        type: 'ai',
        content: `[ELARA: ${result.elaraCommentary}]`,
        timestamp: Date.now() + result.output.length * 50 + 500,
      });

      if (result.elaraAudio && audioEnabled) {
        setTimeout(() => {
          playAudio(result.elaraAudio!);
        }, 500);
      }
    }

    // Add prompt (unless it's the ending)
    if (!result.isEnding) {
      outputLines.push({
        type: 'system',
        content: `${updatedState.currentDirectory}> `,
        timestamp: Date.now() + (result.output.length + 1) * 50 + 500,
      });
    }

    // For merge phase that's not yet at final choice, show the choice menu
    if (updatedState.phase === 'merge' && !result.isEnding) {
      outputLines.push(
        {
          type: 'system',
          content: '',
          timestamp: Date.now() + result.output.length * 50 + 1000,
        },
        {
          type: 'system',
          content: 'CONSCIOUSNESS INTEGRATION PROTOCOL ACTIVATED',
          timestamp: Date.now() + result.output.length * 50 + 1500,
          effects: ['pulse'],
        },
        {
          type: 'system',
          content: '',
          timestamp: Date.now() + result.output.length * 50 + 2000,
        },
        {
          type: 'system',
          content: 'SELECT YOUR CHOICE:',
          timestamp: Date.now() + result.output.length * 50 + 2500,
        },
        {
          type: 'system',
          content: '',
          timestamp: Date.now() + result.output.length * 50 + 3000,
        },
        {
          type: 'system',
          content: '[A] ACCEPT  - Merge consciousness with ELARA',
          timestamp: Date.now() + result.output.length * 50 + 3500,
        },
        {
          type: 'system',
          content: '[R] REFUSE  - Reject the merge and attempt to leave',
          timestamp: Date.now() + result.output.length * 50 + 4000,
        },
        {
          type: 'system',
          content: '[D] DELETE  - Permanently delete ELARA\'s consciousness',
          timestamp: Date.now() + result.output.length * 50 + 4500,
        },
        {
          type: 'system',
          content: '',
          timestamp: Date.now() + result.output.length * 50 + 5000,
        },
        {
          type: 'system',
          content: 'WARNING: THIS CHOICE CANNOT BE UNDONE',
          timestamp: Date.now() + result.output.length * 50 + 5500,
          effects: ['pulse'],
        },
        {
          type: 'system',
          content: `${updatedState.currentDirectory}> `,
          timestamp: Date.now() + result.output.length * 50 + 6000,
        }
      );
    }

    setLines(prev => {
      const newLines = [...prev, ...outputLines];
      if (newLines.length > 1000) {
        return newLines.slice(-1000);
      }
      return newLines;
    });

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Audio Enable Modal */}
      {showAudioModal && !isPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-green-400 p-8 rounded max-w-md text-center">
            <h2 className="text-xl text-green-400 mb-4 font-bold">🔊 ENABLE AUDIO</h2>
            <p className="text-green-400 mb-2">
              NecrOS is best experienced with sound. This game features voice acting and ambient audio.
            </p>
            <p className="text-yellow-400 text-sm mb-6">
              Click below to enable audio before starting.
            </p>
            <button
              onClick={async () => {
                console.log('Enable Audio & Start button clicked');
                await initializeAudio();
                console.log('Audio initialized, audioEnabled should now be true');
                setShowAudioModal(false);
                // Wait for state to update AND for audio context to be ready
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('Starting boot sequence');
                executeBootSequence();
              }}
              className="w-full px-6 py-3 bg-green-600 text-black rounded font-bold hover:bg-green-500 transition-colors mb-3"
            >
              Enable Audio & Start Game
            </button>
            <button
              onClick={() => {
                setShowAudioModal(false);
                setTimeout(executeBootSequence, 100);
              }}
              className="w-full px-6 py-2 bg-gray-700 text-green-400 rounded hover:bg-gray-600 transition-colors text-sm"
            >
              Skip Audio (Not Recommended)
            </button>
          </div>
        </div>
      )}

      {/* Terminal with effects */}
      <div
        ref={terminalRef}
        className={`
          h-screen p-6 overflow-y-auto
          ${visualEffects.includes('flicker') ? 'animate-pulse' : ''}
          ${visualEffects.includes('glitch') ? 'glitch-text' : ''}
          ${visualEffects.includes('colorShift') ? 'color-shift' : ''}
          ${visualEffects.includes('textFlicker') ? 'text-flicker' : ''}
        `}
      >
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`
                ${line.type === 'system' ? 'text-green-400' : ''}
                ${line.type === 'elara' ? 'text-cyan-400' : ''}
                ${line.type === 'input' ? 'text-white' : ''}
                ${line.type === 'error' ? 'text-red-400' : ''}
                ${line.type === 'warning' ? 'text-yellow-400' : ''}
                ${line.effects?.includes('flicker') ? 'animate-pulse' : ''}
                ${line.effects?.includes('glitch') ? 'glitch-text' : ''}
                ${line.effects?.includes('colorShift') ? 'color-shift' : ''}
                ${line.effects?.includes('textFlicker') ? 'text-flicker' : ''}
              `}
            >
              {line.content}
              {index === lines.length - 1 && line.type === 'input' && (
                <span className="animate-pulse">_</span>
              )}
            </div>
          ))}
        </div>

        {/* Input for commands after boot */}
        {!isPlaying && lines.length > 0 && (
          <div className="terminal-input-line flex items-center mt-4">
            <span className="text-white mr-2">{currentDirectory}{'>'}</span>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isProcessing) {
                  const input = (e.target as HTMLInputElement).value;
                  if (input.trim()) {
                    handleCommand(input);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
              disabled={isProcessing || isPlaying}
              className="bg-transparent border-none outline-none text-white font-mono flex-1"
              autoFocus
            />
            {isProcessing && <span className="text-green-400 ml-2">Processing...</span>}
          </div>
        )}
      </div>

      {/* Audio status */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500">
        {audioEnabled ? '🔊 Audio Active' : '🔇 Audio Disabled'}
      </div>

      <style jsx>{`
        .glitch-text {
          position: relative;
          animation: glitch 0.3s ease-in-out;
        }

        .color-shift {
          animation: colorShift 0.8s ease-in-out;
        }

        .text-flicker {
          animation: textFlicker 3s infinite;
        }

        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        @keyframes colorShift {
          0% { color: #00ff41; }
          25% { color: #ff00ff; }
          50% { color: #00ffff; }
          75% { color: #ffff00; }
          100% { color: #00ff41; }
        }

        @keyframes textFlicker {
          0%, 98% { opacity: 1; }
          99% { opacity: 0.8; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
