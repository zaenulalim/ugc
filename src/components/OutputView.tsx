import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Edit3,
  CheckCircle2,
  Film,
  Image as ImageIcon,
  ChevronRight,
  ArrowLeft,
  Sliders,
} from 'lucide-react';
import { StoryboardConfig, StoryboardOutput } from '../types/storyboard';

interface OutputViewProps {
  output: StoryboardOutput;
  config: StoryboardConfig;
  onRegenerate: () => void;
  onEditSettings: () => void;
  onResetProject: () => void;
  onShowToast: (msg: string) => void;
  onUpdateOutputPrompts: (tti: string, ttv: string) => void;
}

export const OutputView: React.FC<OutputViewProps> = ({
  output,
  config,
  onRegenerate,
  onEditSettings,
  onResetProject,
  onShowToast,
  onUpdateOutputPrompts,
}) => {
  const [isEditingTTI, setIsEditingTTI] = useState(false);
  const [isEditingTTV, setIsEditingTTV] = useState(false);
  const [localTTI, setLocalTTI] = useState(output.finalTextToImagePrompt);
  const [localTTV, setLocalTTV] = useState(output.finalTextToVideoPrompt);

  const [copiedTTI, setCopiedTTI] = useState(false);
  const [copiedTTV, setCopiedTTV] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyTTI = async () => {
    try {
      await navigator.clipboard.writeText(localTTI);
      setCopiedTTI(true);
      onShowToast('Text-to-Image Prompt copied to clipboard!');
      setTimeout(() => setCopiedTTI(false), 2000);
    } catch {
      onShowToast('Failed to copy. Please manually copy the text.');
    }
  };

  const handleCopyTTV = async () => {
    try {
      await navigator.clipboard.writeText(localTTV);
      setCopiedTTV(true);
      onShowToast('Text-to-Video Prompt copied to clipboard!');
      setTimeout(() => setCopiedTTV(false), 2000);
    } catch {
      onShowToast('Failed to copy. Please manually copy the text.');
    }
  };

  const handleCopyAll = async () => {
    const combined = `ADVERTISEMENT STORYBOARD STUDIO
=====================================================
${output.storyboardSummary}
=====================================================

FINAL TEXT-TO-IMAGE PROMPT:
-----------------------------------------------------
${localTTI}

=====================================================
FINAL TEXT-TO-VIDEO PROMPT:
-----------------------------------------------------
${localTTV}
`;
    try {
      await navigator.clipboard.writeText(combined);
      setCopiedAll(true);
      onShowToast('Both TTI and TTV prompts copied to clipboard!');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      onShowToast('Failed to copy. Please manually copy the text.');
    }
  };

  const handleDownloadTxt = () => {
    const content = `ADVERTISEMENT STORYBOARD STUDIO
AI-Powered Advertising Storyboard & Prompt Generator
Generated: ${new Date(output.timestamp).toLocaleString()}

PRODUCT: ${config.productName || 'Commercial Product'}
TARGET AUDIENCE: ${config.targetAudience}
STORY TYPE: ${config.storyType}
ADVERTISEMENT STYLE: ${config.advertisementStyle}
STRUCTURE: ${config.numberOfParts} Parts · ${output.totalPanels} Total Panels
VIDEO SPECS: ${config.duration} | ${config.aspectRatio} | ${config.videoQuality}

================================================================================
STORYBOARD SUMMARY
================================================================================
${output.storyboardSummary}

================================================================================
FINAL TEXT-TO-IMAGE PROMPT
================================================================================
${localTTI}

================================================================================
FINAL TEXT-TO-VIDEO PROMPT
================================================================================
${localTTV}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedName = (config.productName || 'storyboard')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
    link.download = `${sanitizedName}_storyboard_prompts.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Downloaded storyboard prompts as TXT file!');
  };

  const handleSaveTTIEdit = () => {
    setIsEditingTTI(false);
    onUpdateOutputPrompts(localTTI, localTTV);
    onShowToast('Image prompt edits saved.');
  };

  const handleSaveTTVEdit = () => {
    setIsEditingTTV(false);
    onUpdateOutputPrompts(localTTI, localTTV);
    onShowToast('Video prompt edits saved.');
  };

  const partsList = Array.from({ length: config.numberOfParts }, (_, i) => i + 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Navigation & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/5 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEditSettings}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Settings</span>
          </button>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Generated Storyboard Prompts</span>
              <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Synchronized Pair
              </span>
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAll}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-950/30 flex items-center gap-1.5 transition-colors"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>COPY ALL</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>DOWNLOAD (.TXT)</span>
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>GENERATE AGAIN</span>
          </button>
        </div>
      </div>

      {/* STORYBOARD SUMMARY PANEL */}
      <div className="p-5 rounded-2xl bg-[#0B101D] border border-cyan-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono">
              STORYBOARD SUMMARY
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {new Date(output.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Product</span>
            <span className="font-semibold text-white truncate block">{config.productName || 'Product'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Story</span>
            <span className="font-semibold text-slate-200 truncate block">{config.storyType}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Ad Style</span>
            <span className="font-semibold text-slate-200 truncate block">{config.advertisementStyle}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Parts</span>
            <span className="font-semibold text-cyan-400 block">{config.numberOfParts} Parts</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Panels</span>
            <span className="font-semibold text-cyan-400 block font-mono">{output.totalPanels} Panels</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Camera</span>
            <span className="font-semibold text-slate-200 truncate block">{config.cameraMovement}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Aspect Ratio</span>
            <span className="font-semibold text-slate-200 block font-mono">{config.aspectRatio}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Voice Over</span>
            <span className={`font-semibold block ${config.voiceOver ? 'text-emerald-400' : 'text-slate-400'}`}>
              {config.voiceOver ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Visual Timeline Section */}
        <div className="pt-2 border-t border-white/5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Narrative Structure Timeline
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {partsList.map((partNum, idx) => {
              const panelCount = config.panelsPerPart[partNum] || 3;
              return (
                <React.Fragment key={partNum}>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-xs font-semibold text-slate-200">Part {partNum}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: panelCount }, (_, pIdx) => (
                        <span
                          key={pIdx}
                          className="w-5 h-5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 text-[10px] font-mono flex items-center justify-center font-bold"
                        >
                          P{pIdx + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                  {idx < partsList.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* TWO MAIN CARDS: CARD 1 (TTI) & CARD 2 (TTV) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: FINAL TEXT-TO-IMAGE PROMPT */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  FINAL TEXT-TO-IMAGE PROMPT
                </h2>
                <p className="text-[11px] text-slate-400">One Master Multi-Panel Storyboard Prompt</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (isEditingTTI) handleSaveTTIEdit();
                  else setIsEditingTTI(true);
                }}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/5 transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3 text-cyan-400" />
                <span>{isEditingTTI ? 'Save' : 'Edit'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyTTI}
                className="px-3 py-1 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
              >
                {copiedTTI ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTTI ? 'COPIED!' : 'COPY PROMPT'}</span>
              </button>
            </div>
          </div>

          {/* Prompt Viewer / Editor */}
          <div className="flex-1 flex flex-col">
            {isEditingTTI ? (
              <textarea
                value={localTTI}
                onChange={(e) => setLocalTTI(e.target.value)}
                rows={22}
                className="w-full flex-1 p-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
              />
            ) : (
              <div className="relative flex-1 rounded-xl bg-[#070B13] border border-white/5 p-4 overflow-y-auto max-h-[580px] font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-text selection:bg-cyan-500/20">
                {localTTI}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
            <span>Compatible with: Midjourney, FLUX, Stable Diffusion, Nano Banana</span>
            <span>{localTTI.length} characters</span>
          </div>
        </div>

        {/* CARD 2: FINAL TEXT-TO-VIDEO PROMPT */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  FINAL TEXT-TO-VIDEO PROMPT
                </h2>
                <p className="text-[11px] text-slate-400">One Master Motion Script & Direction</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (isEditingTTV) handleSaveTTVEdit();
                  else setIsEditingTTV(true);
                }}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/5 transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3 text-indigo-400" />
                <span>{isEditingTTV ? 'Save' : 'Edit'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyTTV}
                className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
              >
                {copiedTTV ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTTV ? 'COPIED!' : 'COPY PROMPT'}</span>
              </button>
            </div>
          </div>

          {/* Prompt Viewer / Editor */}
          <div className="flex-1 flex flex-col">
            {isEditingTTV ? (
              <textarea
                value={localTTV}
                onChange={(e) => setLocalTTV(e.target.value)}
                rows={22}
                className="w-full flex-1 p-4 rounded-xl bg-slate-950 border border-indigo-500/40 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            ) : (
              <div className="relative flex-1 rounded-xl bg-[#070B13] border border-white/5 p-4 overflow-y-auto max-h-[580px] font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-text selection:bg-indigo-500/20">
                {localTTV}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
            <span>Compatible with: Veo, Sora, Kling, Runway Gen-3, Luma Dream Machine</span>
            <span>{localTTV.length} characters</span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Footer */}
      <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-slate-950/90 border border-white/10 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEditSettings}
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 transition-colors flex items-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Settings</span>
          </button>
          <button
            type="button"
            onClick={onResetProject}
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Project</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-4 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download .TXT</span>
          </button>
          <button
            type="button"
            onClick={handleCopyAll}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            {copiedAll ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
            <span>COPY ALL PROMPTS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
