export interface StoryboardConfig {
  // Product
  productImage: string; // Base64 data URL
  productImageName: string;
  productName: string;
  productDescription: string;
  sellingPoints: string[];
  targetAudience: string;

  // Model / Character
  modelImage?: string; // Base64 data URL
  modelImageName?: string;
  hasModel: boolean;

  // Storyboard Structure
  numberOfParts: number; // 1 - 10, default 3
  panelsPerPart: Record<number, number>; // e.g. { 1: 3, 2: 4, 3: 3 }

  // Story & Style
  storyType: string;
  customStory?: string;
  advertisementStyle: string;
  customAdvertisementStyle?: string;

  // Camera & Visuals
  cameraAngles: string[]; // Multi-select
  cameraMovement: string;
  visualStyle: string;
  lighting: string;
  environment: string;
  customEnvironment?: string;

  // Video Settings
  duration: string; // "5 sec", "10 sec", "15 sec", "20 sec", "30 sec", "45 sec", "60 sec"
  aspectRatio: string; // "9:16", "16:9", "1:1", "4:5"
  videoQuality: string; // "Standard", "High", "Cinematic"
  motionIntensity: string; // "Low", "Medium", "High"

  // Audio & Voice
  voiceOver: boolean;
  voiceType?: string; // "Female", "Male", "Neutral"
  voiceStyle?: string; // "Natural", "Friendly", "Energetic", "Calm", "Premium", "Emotional", "Persuasive", "Influencer"
  language?: string; // "Indonesian", "English", "Arabic", "Malay", "Japanese", "Korean", "Spanish", "Custom"
  customLanguage?: string;
  dialogue: boolean;
  backgroundMusic: boolean;
  soundEffects: boolean;

  // Text & CTA
  textOverlay: boolean;
  cta: string; // "No CTA", "Shop Now", "Buy Now", "Learn More", "Try It Now", "Order Today", "Check It Out", "Custom CTA"
  customCta?: string;
}

export interface StoryboardOutput {
  storyboardSummary: string;
  finalTextToImagePrompt: string;
  finalTextToVideoPrompt: string;
  timestamp: string;
  totalPanels: number;
}

export type GenerationStep =
  | 'idle'
  | 'analyzing_product'
  | 'building_story'
  | 'planning_panels'
  | 'creating_image_prompt'
  | 'creating_video_prompt'
  | 'checking_continuity'
  | 'complete';
