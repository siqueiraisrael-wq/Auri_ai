export type TabType = 'chat' | 'gallery' | 'persona' | 'hardware';

export interface CompanionMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: string;
  mediaType?: 'photo' | 'video';
  mediaUrl?: string;
  gradientBg?: string;
  promptUsed?: string;
}

export interface CompanionPersona {
  name: string;
  age: number;
  archetype: string;
  avatarBg: string;
  affection: number; // 0 to 100
  mood: 'Apaixonada' | 'Carinhosa' | 'Divertida' | 'Inspiradora';
  systemPrompt: string;
  statusText: string;
  // Persistent Physical Traits & Character Consistency
  physicalTraits: string;
  referenceImageUrl: string;
  consistencyPrompt: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video';
  backend: 'KoboldCpp' | 'Flux.1 Dev' | 'Wan2.1';
  status: 'loaded' | 'unloaded' | 'loading' | 'error';
  vramUsageGb: number;
  maxContext?: number;
  quantization?: string;
  path: string;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  prompt: string;
  timestamp: string;
  mediaUrl: string;
  gradientBg: string;
  isFavorite: boolean;
}
