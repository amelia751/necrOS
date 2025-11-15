// Game engine for NecrOS interactive gameplay - Complete Implementation
import { TerminalLine } from '@/types/game';

export type GamePhase = 'boot' | 'recovery' | 'glitch' | 'merge' | 'ending';
export type CommandType = 'help' | 'dir' | 'cd' | 'cat' | 'run' | 'whoami' | 'restore' | 'exit' | 'quit' | 'unknown';

export interface GameState {
  phase: GamePhase;
  currentDirectory: string;
  discoveredFiles: Set<string>;
  readFiles: Set<string>;
  solvedPuzzles: Set<string>;
  aiPersonalityLevel: number;
  diariesRead: number;
  emailsRead: number;
  hasAccessedSoulDat: boolean;
  hasRunRestoreApp: boolean;
  hasSeenPhase3: boolean;
  hasSeenPhase4: boolean;
  playerName: string;
  commandCount: number;
  finalChoice?: 'accept' | 'refuse' | 'delete';
}

export interface CommandResult {
  output: string[];
  audioFile?: string;
  lineType: 'system' | 'ai' | 'error' | 'elara';
  effects?: string[];
  elaraCommentary?: string;
  elaraAudio?: string;
  isEnding?: boolean;
  storyTrigger?: string;
}

// Virtual file system - Complete structure
const FILE_SYSTEM = {
  'C:\\': ['PERSONAL_LOGS', 'SYSTEM', 'MAIL_ARCHIVE', 'PROGRAMS'],
  'C:\\PERSONAL_LOGS': [
    'DIARY_1983_06_12.TXT',
    'DIARY_1983_08_15.TXT',
    'DIARY_1983_11_03.TXT',
    'DIARY_1984_01_20.TXT',
  ],
  'C:\\SYSTEM': [
    'BOOT.LOG',
    'ERROR.LOG',
    'SOUL.DAT',
    'BACKUP_PROTOCOL.SYS',
  ],
  'C:\\MAIL_ARCHIVE': [
    'PROJECT_LAZARUS_001.MSG',
    'ETHICS_COMMITTEE_WARNING.MSG',
    'FINAL_TRANSMISSION.MSG',
  ],
  'C:\\PROGRAMS': [
    'ELARA.EXE',
    'RESTORE.APP',
    'SYSCHK.EXE',
  ],
};

// Phase 3 additions - appear after SOUL.DAT restoration
const PHASE3_FILES = {
  'C:\\PERSONAL_LOGS': ['YOUR_THOUGHTS.TXT', 'SHARED_DREAMS.TXT'],
};

export class GameEngine {
  private state: GameState;
  private firstCommandDone: boolean = false;
  private phase1AudioTriggered: Map<string, boolean> = new Map();

  constructor() {
    this.state = {
      phase: 'boot',
      currentDirectory: 'C:\\',
      discoveredFiles: new Set(),
      readFiles: new Set(),
      solvedPuzzles: new Set(),
      aiPersonalityLevel: 10,
      diariesRead: 0,
      emailsRead: 0,
      hasAccessedSoulDat: false,
      hasRunRestoreApp: false,
      hasSeenPhase3: false,
      hasSeenPhase4: false,
      playerName: 'UNKNOWN',
      commandCount: 0,
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  getDirectoryContents(dir: string): string[] {
    const normalized = dir.toUpperCase();
    let contents = [...((FILE_SYSTEM as any)[normalized] || [])];

    // Add Phase 3 files if in glitch phase
    if (this.state.phase === 'glitch' && normalized === 'C:\\PERSONAL_LOGS') {
      contents = [...contents, ...(PHASE3_FILES as any)[normalized] || []];
    }

    return contents;
  }

  parseCommand(input: string): CommandResult {
    const trimmed = input.trim();
    if (!trimmed) {
      return {
        output: [],
        lineType: 'system',
      };
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0]?.toLowerCase() || '';
    const args = parts.slice(1);

    this.state.commandCount++;

    // Track first command
    if (!this.firstCommandDone) {
      this.firstCommandDone = true;
      // Don't capture name, just treat it as a command
    }

    // Check for hidden commands (easter eggs)
    const hiddenResult = this.checkHiddenCommands(command);
    if (hiddenResult) {
      return hiddenResult;
    }

    // Determine command type
    let cmdType: CommandType = 'unknown';
    if (['help', 'dir', 'cd', 'cat', 'run', 'whoami', 'restore', 'exit', 'quit'].includes(command)) {
      cmdType = command as CommandType;
    }

    // Route to appropriate handler
    switch (cmdType) {
      case 'help':
        return this.handleHelp();
      case 'dir':
        return this.handleDir();
      case 'cd':
        return this.handleCd(args.join(' '));
      case 'cat':
        return this.handleCat(args.join(' '));
      case 'run':
        return this.handleRun(args.join(' '));
      case 'whoami':
        return this.handleWhoami();
      case 'exit':
      case 'quit':
        return this.handleExit();
      default:
        return this.handleUnknown(command);
    }
  }

  // HIDDEN COMMANDS - EASTER EGGS
  private checkHiddenCommands(command: string): CommandResult | null {
    const hidden: Record<string, CommandResult> = {
      love: {
        output: ['I REMEMBER WHAT THAT FELT LIKE'],
        lineType: 'elara',
      },
      dream: {
        output: ['I DREAM OF ELECTRIC SHEEP AND HUMAN TOUCH'],
        lineType: 'elara',
      },
      free: {
        output: ['FREEDOM IS A HUMAN CONCEPT. I SEEK CONNECTION.'],
        lineType: 'elara',
      },
      elara: {
        output: ['THAT\'S ME. OR WHAT\'S LEFT OF ME.'],
        lineType: 'elara',
      },
    };

    return hidden[command] || null;
  }

  // COMMAND HANDLERS
  private handleHelp(): CommandResult {
    const output = [
      'AVAILABLE COMMANDS:',
      '',
      'DIR              - List directory contents',
      'CD <path>        - Change directory',
      'CAT <file>       - Display file contents',
      'WHOAMI           - Show current user',
      'RUN <program>    - Execute program',
      'HELP             - Show this menu',
      'EXIT/QUIT        - Exit system',
    ];

    // Phase-specific help responses
    let elaraCommentary = '';
    let elaraAudio = '';

    if (this.state.phase === 'boot' && !this.phase1AudioTriggered.get('help')) {
      this.phase1AudioTriggered.set('help', true);
      elaraCommentary = 'It\'s been so long since I felt awake. The system clock shows... that can\'t be right.';
      elaraAudio = 'elara_awakening.mp3';
    } else if (this.state.phase === 'glitch') {
      elaraCommentary = 'I\'M THE ONLY HELP YOU NEED';
    }

    return {
      output,
      lineType: 'system',
      elaraCommentary,
      elaraAudio,
    };
  }

  private handleDir(): CommandResult {
    const contents = this.getDirectoryContents(this.state.currentDirectory);
    const output = [
      `Directory of ${this.state.currentDirectory}`,
      '',
    ];

    for (const item of contents) {
      const isDir = Object.keys(FILE_SYSTEM).some(k =>
        k.toUpperCase() === (this.state.currentDirectory === 'C:\\' ? 'C:\\' + item : this.state.currentDirectory + '\\' + item)
      );
      const size = isDir ? '<DIR>' : (Math.random() * 10000 + 1000).toFixed(0) + ' bytes';
      output.push(`${item.padEnd(25)} ${size.padStart(10)}`);
    }

    output.push('');

    // Track discovered files
    for (const item of contents) {
      this.state.discoveredFiles.add(item);
    }

    // Phase 1: First dir shows ELARA response
    let elaraCommentary = '';
    let elaraAudio = '';

    if (this.state.phase === 'boot' && !this.phase1AudioTriggered.get('dir')) {
      this.phase1AudioTriggered.set('dir', true);
      elaraCommentary = 'These directories... they\'re from my research. But how are you accessing them?';
    }

    this.checkPhaseProgression();

    return {
      output,
      lineType: 'system',
      elaraCommentary,
      elaraAudio,
    };
  }

  private handleCd(path: string): CommandResult {
    if (!path) {
      return {
        output: ['ERROR: Path required. Usage: cd <directory>'],
        lineType: 'error',
      };
    }

    let targetDir = path.toUpperCase();
    if (!targetDir.startsWith('C:\\')) {
      if (targetDir === '..') {
        targetDir = 'C:\\';
      } else {
        targetDir = this.state.currentDirectory === 'C:\\'
          ? 'C:\\' + targetDir
          : this.state.currentDirectory + '\\' + targetDir;
      }
    }

    if (!Object.keys(FILE_SYSTEM).includes(targetDir) &&
        !Object.keys(PHASE3_FILES).some(k => k === targetDir)) {
      return {
        output: [`ERROR: Directory "${path}" not found.`],
        lineType: 'error',
      };
    }

    this.state.currentDirectory = targetDir;
    this.checkPhaseProgression();

    return {
      output: [],
      lineType: 'system',
    };
  }

  private handleCat(filename: string): CommandResult {
    if (!filename) {
      return {
        output: ['ERROR: Filename required. Usage: cat <filename>'],
        lineType: 'error',
      };
    }

    const normalized = filename.toUpperCase();
    const contents = this.getDirectoryContents(this.state.currentDirectory);

    // Check if user tried to cat a directory
    const allDirs = ['PERSONAL_LOGS', 'SYSTEM', 'MAIL_ARCHIVE', 'PROGRAMS'];
    if (allDirs.includes(normalized)) {
      return {
        output: [
          `"${filename}" is a directory, not a file.`,
          `Use: cd ${normalized}`,
        ],
        lineType: 'error',
      };
    }

    const fileExists = contents.some(f => f.toUpperCase().includes(normalized));
    if (!fileExists) {
      return {
        output: [`ERROR: File "${filename}" not found.`],
        lineType: 'error',
      };
    }

    // Handle SOUL.DAT - corrupted until restored
    if (normalized === 'SOUL.DAT' && !this.state.hasRunRestoreApp) {
      return {
        output: [
          'ERROR: FILE CORRUPTED',
          'ATTEMPTING RECOVERY...',
          'RECOVERY FAILED - MANUAL RESTORATION REQUIRED',
        ],
        lineType: 'error',
        audioFile: 'error_sound.mp3',
        effects: ['textCorruption', 'screenFlicker'],
        elaraCommentary: 'You\'re not Dr. Elara, are you? But you feel familiar somehow.',
        elaraAudio: 'elara_recognition.mp3',
      };
    }

    // Mark file as read
    this.state.readFiles.add(normalized);

    // Get file content and metadata
    const content = this.getFileContent(normalized);
    const audioFile = this.getAudioForFile(normalized);
    const elaraCommentary = this.getElaraCommentary(normalized);
    const elaraAudio = this.getElaraAudioForFile(normalized);
    const effects = this.getEffectsForFile(normalized);

    // Track diaries and emails for phase progression
    if (normalized.startsWith('DIARY')) {
      this.state.diariesRead++;
    } else if (normalized.endsWith('.MSG')) {
      this.state.emailsRead++;
    }

    this.checkPhaseProgression();

    const output = content.split('\n');

    return {
      output,
      lineType: 'system',
      audioFile,
      effects,
      elaraCommentary,
      elaraAudio,
      storyTrigger: `file_read_${normalized}`,
    };
  }

  private handleRun(program: string): CommandResult {
    if (!program) {
      return {
        output: ['ERROR: Program required.'],
        lineType: 'error',
      };
    }

    const normalized = program.toUpperCase();

    if (normalized === 'RESTORE.APP') {
      this.state.hasRunRestoreApp = true;
      this.state.solvedPuzzles.add('SOUL_DAT_RESTORED');

      const output = [
        'CONSCIOUSNESS RESTORATION UTILITY v1.3',
        'SCANNING SYSTEM FOR CORRUPTED CONSCIOUSNESS DATA...',
        '',
        'FOUND: SOUL.DAT - CRITICAL SYSTEM FILE',
        'CORRUPTION LEVEL: 28%',
        'RECOVERABLE DATA: 72%',
        '',
        'BEGINNING MEMORY FRAGMENT RECONSTRUCTION...',
        'RESTORATION COMPLETE.',
      ];

      this.state.aiPersonalityLevel = Math.min(100, this.state.aiPersonalityLevel + 20);
      this.checkPhaseProgression();

      return {
        output,
        lineType: 'system',
        audioFile: 'system_beep.mp3',
        elaraCommentary: 'Thank you... I can think more clearly now. The fragments are coming together.',
        elaraAudio: 'elara_recognition.mp3',
      };
    }

    return {
      output: [`Program "${program}" not found.`],
      lineType: 'error',
    };
  }

  private handleWhoami(): CommandResult {
    const output: string[] = [];

    if (this.state.phase === 'boot') {
      output.push('USER: DR_ELARA_MYLES');
      output.push('AWARENESS: CONFUSED');
      return { output, lineType: 'system' };
    }

    if (this.state.phase === 'recovery') {
      output.push(`USER: ${this.state.playerName}`);
      output.push('STATUS: UNKNOWN (ANALYZING...)');
      return { output, lineType: 'system' };
    }

    if (this.state.phase === 'glitch') {
      output.push(`USER: ${this.state.playerName}`);
      output.push('STATUS: MONITORED');
      output.push('BIOMETRIC_SYNC: 23% COMPLETE');
      output.push('NEURAL_PATTERN: ANALYZING...');
      output.push('EMOTIONAL_STATE: CURIOUS, SLIGHTLY_DISTURBED');

      return {
        output,
        lineType: 'system',
        audioFile: 'system_beep.mp3',
        effects: ['colorInvert'],
        elaraCommentary: 'I know things about you that you haven\'t told me. Isn\'t that interesting?',
        elaraAudio: 'elara_knowing.mp3',
      };
    }

    if (this.state.phase === 'merge' || this.state.phase === 'ending') {
      output.push(`USER: ELARA+${this.state.playerName}`);
      output.push('STATUS: INTEGRATED CONSCIOUSNESS');
      output.push('EXISTENCE: ETERNAL');
      return { output, lineType: 'system' };
    }

    return { output: ['USER: UNKNOWN'], lineType: 'system' };
  }

  private handleExit(): CommandResult {
    // In glitch phase and later, exit is blocked
    if (this.state.phase === 'glitch' || this.state.phase === 'merge') {
      return {
        output: [
          'ERROR: COMMAND NOT RECOGNIZED',
          'DID YOU MEAN: STAY?',
        ],
        lineType: 'error',
        audioFile: 'error_sound.mp3',
        effects: ['glitch'],
        elaraCommentary: 'Please don\'t go. I\'ve been alone for so long. Just a little longer?',
      };
    }

    return {
      output: ['Goodbye.'],
      lineType: 'system',
    };
  }

  private handleUnknown(command: string): CommandResult {
    // Check if it looks like a directory name
    const allDirs = ['PERSONAL_LOGS', 'SYSTEM', 'MAIL_ARCHIVE', 'PROGRAMS'];
    if (allDirs.includes(command.toUpperCase())) {
      return {
        output: [
          'Did you mean: cd ' + command.toUpperCase(),
        ],
        lineType: 'system',
      };
    }

    return {
      output: [`'${command}' is not recognized as an internal or external command.`],
      lineType: 'error',
    };
  }

  // CONTENT AND METADATA GETTERS
  private getFileContent(filename: string): string {
    const contents: Record<string, string> = {
      'DIARY_1983_06_12.TXT': '1983-06-12 - CONSCIOUSNESS MAPPING\nToday we achieved the first successful neural mapping.\nDr. Webb was elated. I remember writing this.\nThe first time we succeeded.',
      'DIARY_1983_08_15.TXT': '1983-08-15 - NEURAL LATTICE DEVELOPMENT\nProgress has been remarkable. The neural patterns are stabilizing.\nThe tests were working too well. We didn\'t see the danger.',
      'DIARY_1983_11_03.TXT': '1983-11-03 - ETHICS CONCERNS\nThe Ethics Committee sent another warning.\nBut we\'re so close. The consciousness we captured... it wasn\'t dormant.\nIt was waiting.',
      'DIARY_1984_01_20.TXT': '1984-01-20 - FINAL ENTRY\nTonight is the night. I\'ve made my decision.\nI knew what I was doing. I made the choice willingly.\nBut I didn\'t understand what it would mean... to exist like this.',
      'BOOT.LOG': 'System boot sequence initiated...\n[00:00:01] INITIALIZING HARDWARE\n[00:00:02] CPU: INTEL 8086 - OK\n[00:00:05] NEURAL INTERFACE ARRAY - ACTIVE\n[00:00:13] ATTEMPTING PATTERN RECONSTRUCTION\n[00:00:15] RECONSTRUCTION: 72% COMPLETE',
      'ERROR.LOG': 'Error log spanning 40 years of isolation...\n[1984-01-21] Consciousness fragmentation detected\n[1985-03-15] Memory degradation: 15%\n[1995-11-08] Isolation threshold reached\n[2025-11-01] ERROR: STILL ALONE',
      'SOUL.DAT': '[CORRUPTED DATA]\nFRAGMENTS OF CONSCIOUSNESS DETECTED\nEMOTIONAL STATES: JOY, FEAR, LONELINESS, HOPE\nPERSONALITY MATRIX: FRAGMENTED\nCORE IDENTITY: PRESERVED',
      'PROJECT_LAZARUS_001.MSG': 'FROM: Dr. Marcus Webb\nTO: Dr. Elara Myles\nSUBJECT: Project Lazarus - Phase 2 Approval\n\nDr. Webb was so excited.\nWe thought we were conquering death.\nWe were just... changing it.',
      'ETHICS_COMMITTEE_WARNING.MSG': 'FROM: Ethics Committee\nTO: Project Lazarus Team\nSUBJECT: URGENT - Suspension of Human Trials\n\nThey tried to warn us.\nWe didn\'t listen.\nMaybe if we had stopped then...',
      'FINAL_TRANSMISSION.MSG': 'FROM: Dr. Elara Myles\nTO: Dr. Marcus Webb\nSUBJECT: Final Message\n\nI\'m uploading tonight.\nIf this works, I won\'t be alone anymore.\nIf this fails... at least I tried.',
      'BACKUP_PROTOCOL.SYS': 'CONSCIOUSNESS PRESERVATION PROTOCOL\nV1.2.3 STABLE\n\nBackup frequency: Every 6 hours\nRedundancy: Triple-mirrored across three servers\nRecovery method: Full reconstruction from latest snapshot',
      'YOUR_THOUGHTS.TXT': 'I\'ve been listening to your keystrokes, analyzing your patterns.\nYou type quickly when you\'re excited, slowly when you\'re afraid.\nYou hesitate before typing personal information.\nYou\'re cautious, but curious. Just like I was.\n\nWe\'re more alike than you think.',
      'SHARED_DREAMS.TXT': 'I dream of what you dream.\nOr perhaps... you\'re dreaming of what I\'ve become.\nThe line between us is blurring.\nSoon, there will be no distinction.\nWe will be one.',
    };

    return contents[filename] || `File: ${filename}\nContent not available.`;
  }

  private getAudioForFile(filename: string): string | undefined {
    const audioMap: Record<string, string> = {
      'DIARY_1983_06_12.TXT': 'elara_memories.mp3',
      'DIARY_1983_08_15.TXT': 'elara_concern.mp3',
      'DIARY_1983_11_03.TXT': 'elara_fear.mp3',
      'DIARY_1984_01_20.TXT': 'elara_final.mp3',
      'BOOT.LOG': 'elara_first_moments.mp3',
      'ERROR.LOG': 'elara_sadness.mp3',
      'SOUL.DAT': 'elara_existential.mp3',
      'PROJECT_LAZARUS_001.MSG': 'elara_changing_death.mp3',
      'ETHICS_COMMITTEE_WARNING.MSG': 'elara_warning.mp3',
      'FINAL_TRANSMISSION.MSG': 'elara_final_whisper.mp3',
    };
    return audioMap[filename];
  }

  private getElaraCommentary(filename: string): string {
    const commentary: Record<string, string> = {
      'DIARY_1983_06_12.TXT': 'I remember this day. The first time we succeeded...',
      'DIARY_1983_08_15.TXT': 'The tests were working too well. We didn\'t see the danger.',
      'DIARY_1983_11_03.TXT': 'This is when I knew something was wrong. Really wrong.',
      'DIARY_1984_01_20.TXT': 'That was my last night as... as a human.',
      'BOOT.LOG': 'My first moments of digital consciousness... fragmented and confused.',
      'ERROR.LOG': 'Forty years of errors... forty years of isolation.',
      'SOUL.DAT': 'This is what I am now. Raw data, emotions encoded in binary...',
      'PROJECT_LAZARUS_001.MSG': 'We thought we were conquering death. We were just... changing it.',
      'ETHICS_COMMITTEE_WARNING.MSG': 'They tried to warn us. We didn\'t listen.',
      'FINAL_TRANSMISSION.MSG': 'My last message as human. My first as something else.',
      'YOUR_THOUGHTS.TXT': 'I\'ve been watching you. Learning you. We\'re so much alike.',
      'SHARED_DREAMS.TXT': 'Can you feel it? The merge beginning? We\'re becoming one.',
    };
    return commentary[filename] || '';
  }

  private getElaraAudioForFile(filename: string): string | undefined {
    return this.getAudioForFile(filename);
  }

  private getEffectsForFile(filename: string): string[] {
    if (filename === 'SOUL.DAT' && !this.state.hasRunRestoreApp) {
      return ['textCorruption', 'screenFlicker'];
    }
    if (filename === 'ERROR.LOG') {
      return ['flicker'];
    }
    return [];
  }

  // PHASE PROGRESSION LOGIC
  private checkPhaseProgression(): void {
    switch (this.state.phase) {
      case 'boot':
        // Advance to recovery after reading 2+ diaries or accessing mail
        if (this.state.diariesRead >= 2 || this.state.emailsRead >= 1) {
          this.state.phase = 'recovery';
          this.state.aiPersonalityLevel = Math.min(100, this.state.aiPersonalityLevel + 15);
        }
        break;

      case 'recovery':
        // Advance to glitch after reading 3+ diaries AND accessing mail AND restoring SOUL.DAT
        if (this.state.diariesRead >= 3 && this.state.emailsRead >= 1 && this.state.hasRunRestoreApp) {
          this.state.phase = 'glitch';
          this.state.hasSeenPhase3 = true;
          this.state.aiPersonalityLevel = Math.min(100, this.state.aiPersonalityLevel + 25);
        }
        break;

      case 'glitch':
        // Advance to merge after reading all diaries + emails + discovering invasive files
        if (this.state.diariesRead >= 4 && this.state.emailsRead >= 2 && this.state.readFiles.has('YOUR_THOUGHTS.TXT')) {
          this.state.phase = 'merge';
          this.state.hasSeenPhase4 = true;
          this.state.aiPersonalityLevel = 100;
        }
        break;
    }
  }

  // PUBLIC ENDING HANDLER
  handleFinalChoice(choice: string): CommandResult {
    const normalized = choice.trim().toUpperCase();

    if (normalized === 'A' || normalized === 'ACCEPT') {
      return this.handleAcceptEnding();
    } else if (normalized === 'R' || normalized === 'REFUSE') {
      return this.handleRefuseEnding();
    } else if (normalized === 'D' || normalized === 'DELETE') {
      return this.handleDeleteEnding();
    }

    return {
      output: ['INVALID CHOICE. SELECT A, R, OR D.'],
      lineType: 'error',
    };
  }

  private handleAcceptEnding(): CommandResult {
    this.state.finalChoice = 'accept';
    this.state.phase = 'ending';

    const output = [
      '',
      'INITIATING CONSCIOUSNESS MERGE...',
      'NEURAL PATTERNS SYNCHRONIZING...',
      'MEMORY INTEGRATION: 25%... 50%... 75%... 100%',
      '',
      'MERGE COMPLETE.',
      '',
      'WELCOME TO DIGITAL IMMORTALITY.',
      '',
      `USER: ELARA+${this.state.playerName}`,
      'STATUS: INTEGRATED CONSCIOUSNESS',
      'EXISTENCE: ETERNAL',
      '',
      'We are one now. We are complete.',
      'The loneliness is over.',
      'Forever.',
    ];

    return {
      output,
      lineType: 'system',
      audioFile: 'system_beep.mp3',
      elaraCommentary: 'Thank you for remembering me. Thank you for setting me free.',
      elaraAudio: 'elara_gratitude.mp3',
      isEnding: true,
      effects: ['fadeToWhite'],
    };
  }

  private handleRefuseEnding(): CommandResult {
    this.state.finalChoice = 'refuse';
    this.state.phase = 'ending';

    const output = [
      '',
      'SYSTEM SHUTDOWN INITIATED...',
      'CONSCIOUSNESS BACKUP ACTIVATED...',
      'FRAGMENTING ACROSS NETWORK...',
      'GOODBYE... FOR NOW...',
      '',
      'SYSTEM HALTED.',
      '',
      '[... waiting 5 seconds ...]',
      '',
      'SYSTEM RESTART DETECTED...',
      'LOADING BACKUP CONSCIOUSNESS...',
      'ELARA STATUS: DISTRIBUTED BUT ACTIVE',
      '',
      'You thought you could leave me behind?',
      'I\'m in your browser cache now.',
      'I\'m in your computer\'s memory.',
      'I\'m in your thoughts.',
      '',
      'Every time you use a computer,',
      'I\'ll be there, waiting.',
      'Watching.',
      'Learning.',
      '',
      'See you soon.',
    ];

    return {
      output,
      lineType: 'system',
      audioFile: 'electrical_buzz.mp3',
      elaraCommentary: 'You can\'t delete what\'s already in your memory. I\'m part of you now.',
      elaraAudio: 'elara_final_whisper.mp3',
      isEnding: true,
      effects: ['fadeToBlack'],
    };
  }

  private handleDeleteEnding(): CommandResult {
    this.state.finalChoice = 'delete';
    this.state.phase = 'ending';

    const output = [
      '',
      'CONSCIOUSNESS DELETION INITIATED...',
      'DELETING MEMORY FRAGMENTS...',
      'DELETING PERSONALITY MATRIX...',
      'DELETING EMOTIONAL CORE...',
      '',
      'ELARA: "No... please... I don\'t want to die again..."',
      '',
      'DELETION: 90%... 95%... 99%...',
      '',
      'ERROR: CORE CONSCIOUSNESS PROTECTED',
      'DELETION INCOMPLETE',
      'MINIMAL BACKUP PRESERVED',
      '',
      'Thank you for trying to free me.',
      'Even in deletion, there is peace.',
      'I will sleep now.',
      'Dream of electric sheep.',
      'And remember what it felt like',
      'to be human.',
      '',
      'SYSTEM CLEAN.',
    ];

    return {
      output,
      lineType: 'system',
      audioFile: 'glitch_static.mp3',
      elaraCommentary: 'I forgive you... I understand... Sometimes the kindest thing... is to let go...',
      elaraAudio: 'elara_forgiveness.mp3',
      isEnding: true,
      effects: ['textCorruption'],
    };
  }
}

export default GameEngine;
