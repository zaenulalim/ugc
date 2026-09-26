import React from 'react';
import { Sparkles, Clapperboard, RotateCcw, Box } from 'lucide-react';
import { SAMPLE_PRESETS } from '../constants/options';

interface HeaderProps {
  onLoadPreset: (presetId: string) => void;
  onResetClick: () => void;
  hasProductImage: boolean;
  activeView: 'editor' | 'output';
  onSwitchView: (view: 'editor' | 'output') => void;
  hasOutput: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadPreset,
  onResetClick,
  hasProductImage,
  activeView,
  onSwitchView,
  hasOutput,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#090D16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-[1px] shadow-lg shadow-cyan-500/10 flex items-center justify-center">
            <div className="w-full h-full bg-[#090D16] rounded-[11px] flex items-center justify-center">
              <Clapperboard className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-sans">
                Advertisement Storyboard Studio
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" /> AI Director
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              AI-Powered Advertising Storyboard & Prompt Generator
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links / View Switcher */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => onSwitchView('editor')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeView === 'editor'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Storyboard Studio
          </button>
          <button
            type="button"
            onClick={() => onSwitchView('output')}
            disabled={!hasOutput}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'output'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : hasOutput
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <span>Generated Storyboard</span>
            {hasOutput && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </button>
        </div>

        {/* Zone 3: Primary Actions (Preset Loader & Reset) */}
        <div className="flex items-center gap-2">
          {/* Quick presets dropdown / buttons */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1">
              Sample:
            </span>
            {SAMPLE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onLoadPreset(p.id)}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                title={`Load ${p.title}`}
              >
                <Box className="w-3 h-3 text-cyan-400" />
                <span className="truncate max-w-[90px]">{p.id === 'sneaker' ? 'Sneakers' : 'Serum'}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onResetClick}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all text-xs flex items-center gap-1.5"
            title="Reset storyboard project"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden lg:inline text-xs">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
