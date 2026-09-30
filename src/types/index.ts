export type WorkspaceType = 
  | 'overview' 
  | 'image' 
  | 'video' 
  | 'voice' 
  | 'music' 
  | 'livecam' 
  | 'vault' 
  | 'deployments'
  | 'pricing'
  | 'imagelab';

export type MediaType = 'image' | 'video' | 'voice' | 'music';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  prompt: string;
  createdAt: string;
  tags: string[];
  dimensions?: string;
  duration?: string;
  format: string;
  creditsUsed: number;
  metadata?: Record<string, any>;
}

export interface ImageAdjustments {
  brightness: number; // 0 - 200, default 100
  contrast: number;   // 0 - 200, default 100
  saturation: number; // 0 - 200, default 100
  blur: number;       // 0 - 20, default 0
  hueRotate: number;  // 0 - 360, default 0
  sepia: number;      // 0 - 100, default 0
  vignette: number;   // 0 - 100, default 0
  aspectRatio: '16:9' | '1:1' | '9:16' | '4:3';
}

export interface TimelineClip {
  id: string;
  title: string;
  track: 'video' | 'audio' | 'subtitle';
  start: number; // seconds
  duration: number; // seconds
  color: string;
  content?: string;
}

export interface VoicePreset {
  id: string;
  name: string;
  role: string;
  gender: 'male' | 'female' | 'neural';
  accent: string;
  sampleAudioText: string;
  color: string;
}

export interface StemChannel {
  id: string;
  name: string;
  volume: number; // 0 - 100
  isMuted: boolean;
  isSolo: boolean;
  pan: number; // -50 to 50
  color: string;
}

export interface CreditPlan {
  id: string;
  name: string;
  tagline: string;
  credits: number;
  price: number;
  popular?: boolean;
  features: string[];
  costPerCredit: string;
}

export interface StudioProjectBrief {
  conceptTitle: string;
  summary: string;
  imagePrompt: string;
  imageStyle: string;
  videoPrompt: string;
  videoMotion: string;
  voiceScript: string;
  voicePersona: string;
  musicGenre: string;
  musicBpm: number;
  musicMood: string;
  musicPrompt?: string;
}

export interface ProjectDeployment {
  id: string;
  name: string;
  appFramework: 'Next.js' | 'SvelteKit' | 'React SPA' | 'HTML5 Video' | 'Audio Web Player';
  target: 'front' | 'next-site' | 'svelte-app' | 'client-portal' | 'custom';
  status: 'ready' | 'building' | 'error';
  previewUrl: string;
  updatedAt: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  assetsCount: number;
  environment: 'production' | 'preview';
  deployDuration: string;
  logs: string[];
}

