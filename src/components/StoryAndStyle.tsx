import React from 'react';
import { STORY_TYPES, ADVERTISEMENT_STYLES } from '../constants/options';
import { Sparkles } from 'lucide-react';

interface StoryAndStyleProps {
  storyType: string;
  customStory?: string;
  advertisementStyle: string;
  customAdvertisementStyle?: string;
  onStoryTypeChange: (val: string) => void;
  onCustomStoryChange: (val: string) => void;
  onAdStyleChange: (val: string) => void;
  onCustomAdStyleChange: (val: string) => void;
}

export const StoryAndStyle: React.FC<StoryAndStyleProps> = ({
  storyType,
  customStory = '',
  advertisementStyle,
  customAdvertisementStyle = '',
  onStoryTypeChange,
  onCustomStoryChange,
  onAdStyleChange,
  onCustomAdStyleChange,
}) => {
  return (
    <div className="space-y-8">
      {/* 1. STORY TYPE */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-white/5">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Story Type & Narrative Arc</span>
          </h2>
          <p className="text-xs text-slate-400">
            Select the advertising storytelling formula that will structure your panels from hook to conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {STORY_TYPES.map((type) => {
            const isSelected = storyType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onStoryTypeChange(type.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/10 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-cyan-300' : 'text-slate-200'
                      }`}
                    >
                      {type.label}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {type.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {storyType === 'Custom Story' && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/40 space-y-2 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
              Describe Your Story
            </label>
            <textarea
              rows={3}
              value={customStory}
              onChange={(e) => onCustomStoryChange(e.target.value)}
              placeholder="e.g. A busy working mother discovers this 30-second morning skincare routine that gives her an instant radiant glow before her first meeting."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
            />
          </div>
        )}
      </div>

      {/* 2. ADVERTISEMENT STYLE */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-white/5">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Advertisement Style</span>
          </h2>
          <p className="text-xs text-slate-400">
            Governs the visual language, camera proximity, and format (e.g. casual creator UGC, mirror check, or high-end cinematic studio).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
          {ADVERTISEMENT_STYLES.map((style) => {
            const isSelected = advertisementStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onAdStyleChange(style.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/20'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/10 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold tracking-wide ${
                        isSelected ? 'text-indigo-300' : 'text-slate-200'
                      }`}
                    >
                      {style.label}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {style.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {advertisementStyle === 'CUSTOM' && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/40 space-y-2 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Describe Advertisement Style
            </label>
            <textarea
              rows={3}
              value={customAdvertisementStyle}
              onChange={(e) => onCustomAdStyleChange(e.target.value)}
              placeholder="e.g. 90s vintage film commercial, saturated grain, warm halation, candid telephoto angles, handheld energy."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
