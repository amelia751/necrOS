// Visual and audio effects interfaces
export interface EffectTrigger {
  type: EffectType;
  intensity: number;
  duration: number;
  target?: string;
  delay?: number;
}

export enum EffectType {
  TextScramble = 'text_scramble',
  ScreenFlicker = 'screen_flicker',
  ColorInvert = 'color_invert',
  PhantomText = 'phantom_text',
  StaticOverlay = 'static_overlay',
  GlitchText = 'glitch_text',
  CRTDistortion = 'crt_distortion'
}

export interface GlitchEffect {
  type: EffectType;
  intensity: number;
  startTime: number;
  duration: number;
}

export interface AudioManager {
  playAmbient(track: AmbientTrack): void;
  playEffect(effect: SoundEffect): void;
  playAIVoice(text: string, personality: AIPersonalityLevel): void;
  setGlitchLevel(intensity: number): void;
  stop(): void;
}

export enum AmbientTrack {
  CRTHum = 'crt_hum',
  SystemBuzz = 'system_buzz',
  Silence = 'silence'
}

export enum SoundEffect {
  KeyPress = 'key_press',
  SystemBeep = 'system_beep',
  ErrorSound = 'error_sound',
  FileAccess = 'file_access',
  Glitch = 'glitch',
  Whisper = 'whisper'
}

// Import types from other files
import { AIPersonalityLevel } from './story';