import React from 'react';
import {
  DURATION_OPTIONS,
  ASPECT_RATIOS,
  VIDEO_QUALITIES,
  MOTION_INTENSITIES,
  VOICE_TYPES,
  VOICE_STYLES,
  LANGUAGES,
  CTA_OPTIONS,
} from '../constants/options';
import { Mic, Volume2, Type, MousePointerClick, Clock, Maximize2 } from 'lucide-react';

interface VideoAudioSettingsProps {
  duration: string;
  aspectRatio: string;
  videoQuality: string;
  motionIntensity: string;
  voiceOver: boolean;
  voiceType?: string;
  voiceStyle?: string;
  language?: string;
  customLanguage?: string;
  dialogue: boolean;
  backgroundMusic: boolean;
  soundEffects: boolean;
  textOverlay: boolean;
  cta: string;
  customCta?: string;
  onDurationChange: (val: string) => void;
  onAspectRatioChange: (val: string) => void;
  onVideoQualityChange: (val: string) => void;
  onMotionIntensityChange: (val: string) => void;
  onVoiceOverChange: (val: boolean) => void;
  onVoiceTypeChange: (val: string) => void;
  onVoiceStyleChange: (val: string) => void;
  onLanguageChange: (val: string) => void;
  onCustomLanguageChange: (val: string) => void;
  onDialogueChange: (val: boolean) => void;
  onBackgroundMusicChange: (val: boolean) => void;
  onSoundEffectsChange: (val: boolean) => void;
  onTextOverlayChange: (val: boolean) => void;
  onCtaChange: (val: string) => void;
  onCustomCtaChange: (val: string) => void;
}

export const VideoAudioSettings: React.FC<VideoAudioSettingsProps> = ({
  duration,
  aspectRatio,
  videoQuality,
  motionIntensity,
  voiceOver,
  voiceType = 'Female',
  voiceStyle = 'Natural',
  language = 'English',
  customLanguage = '',
  dialogue,
  backgroundMusic,
  soundEffects,
  textOverlay,
  cta,
  customCta = '',
  onDurationChange,
  onAspectRatioChange,
  onVideoQualityChange,
  onMotionIntensityChange,
  onVoiceOverChange,
  onVoiceTypeChange,
  onVoiceStyleChange,
  onLanguageChange,
  onCustomLanguageChange,
  onDialogueChange,
  onBackgroundMusicChange,
  onSoundEffectsChange,
  onTextOverlayChange,
  onCtaChange,
  onCustomCtaChange,
}) => {
  return (
    <div className="space-y-8">
      {/* 1. VIDEO SETTINGS */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-white/5">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Video Specifications</span>
          </h2>
          <p className="text-xs text-slate-400">
            Duration, framing aspect ratio, rendering quality, and motion intensity dynamics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Duration */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Duration
            </label>
            <div className="grid grid-cols-4 gap-1">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDurationChange(d)}
                  className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                    duration === d
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {d.replace(' sec', 's')}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Aspect Ratio</span>
            </label>
            <div className="grid grid-cols-4 gap-1">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar}
                  type="button"
                  onClick={() => onAspectRatioChange(ar)}
                  className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                    aspectRatio === ar
                      ? 'bg-indigo-500 text-white font-bold border-indigo-400'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {ar}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 text-center">
              {aspectRatio === '9:16' ? 'Vertical Reels/TikTok' : aspectRatio === '16:9' ? 'Landscape YouTube/Ad' : 'Square/Social'}
            </p>
          </div>

          {/* Video Quality */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Quality Profile
            </label>
            <div className="grid grid-cols-3 gap-1">
              {VIDEO_QUALITIES.map((vq) => (
                <button
                  key={vq}
                  type="button"
                  onClick={() => onVideoQualityChange(vq)}
                  className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                    videoQuality === vq
                      ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/60 font-semibold'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {vq}
                </button>
              ))}
            </div>
          </div>

          {/* Motion Intensity */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Motion Intensity
            </label>
            <div className="grid grid-cols-3 gap-1">
              {MOTION_INTENSITIES.map((mi) => (
                <button
                  key={mi}
                  type="button"
                  onClick={() => onMotionIntensityChange(mi)}
                  className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                    motionIntensity === mi
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/60 font-semibold'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {mi}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. AUDIO & VOICE OVER SETTINGS */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-white/5">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>Audio & Voice Over Direction</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure spoken voice narration, languages, sound effects, and background music.
          </p>
        </div>

        {/* Voice Over Toggle and details */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Voice Over Narration</h3>
              <p className="text-xs text-slate-400">Include scripted commercial voice-over cues in the video prompt.</p>
            </div>
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => onVoiceOverChange(false)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  !voiceOver ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                OFF
              </button>
              <button
                type="button"
                onClick={() => onVoiceOverChange(true)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  voiceOver ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                ON
              </button>
            </div>
          </div>

          {voiceOver && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 animate-in fade-in duration-150">
              {/* Voice Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Voice Type
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {VOICE_TYPES.map((vt) => (
                    <button
                      key={vt}
                      type="button"
                      onClick={() => onVoiceTypeChange(vt)}
                      className={`py-1.5 text-xs rounded-lg border text-center transition-all ${
                        voiceType === vt
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60 font-semibold'
                          : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {vt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Style */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Voice Tone
                </label>
                <select
                  value={voiceStyle}
                  onChange={(e) => onVoiceStyleChange(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {VOICE_STYLES.map((vs) => (
                    <option key={vs} value={vs}>
                      {vs}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                {language === 'Custom' && (
                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => onCustomLanguageChange(e.target.value)}
                    placeholder="e.g. French, German"
                    className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-white text-xs"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Secondary Audio Toggles (Dialogue, Music, Sound Effects) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Dialogue */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Dialogue</span>
            <button
              type="button"
              onClick={() => onDialogueChange(!dialogue)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                dialogue ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {dialogue ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Background Music */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Background Music</span>
            <button
              type="button"
              onClick={() => onBackgroundMusicChange(!backgroundMusic)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                backgroundMusic ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {backgroundMusic ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Sound Effects */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Sound Effects (SFX)</span>
            <button
              type="button"
              onClick={() => onSoundEffectsChange(!soundEffects)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                soundEffects ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {soundEffects ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. TEXT OVERLAY & CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Overlay */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                On-Screen Text Overlays
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onTextOverlayChange(!textOverlay)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                textOverlay ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {textOverlay ? 'ON' : 'OFF'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Directs AI to specify concise on-screen hook titles, benefit highlights, and CTA badges in the video generation script.
          </p>
        </div>

        {/* Call To Action */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Call To Action (CTA)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {CTA_OPTIONS.map((c) => {
              const isSelected = cta === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCtaChange(c)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all truncate ${
                    isSelected
                      ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/60 font-semibold'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {cta === 'Custom CTA' && (
            <input
              type="text"
              value={customCta}
              onChange={(e) => onCustomCtaChange(e.target.value)}
              placeholder="e.g. Claim 50% Off Today"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};
