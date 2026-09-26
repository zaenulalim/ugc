import React from 'react';
import { Layers, ChevronRight, Hash } from 'lucide-react';

interface StoryboardStructureProps {
  numberOfParts: number;
  panelsPerPart: Record<number, number>;
  onPartsChange: (parts: number) => void;
  onPanelsPerPartChange: (partNum: number, panels: number) => void;
}

export const StoryboardStructure: React.FC<StoryboardStructureProps> = ({
  numberOfParts,
  panelsPerPart,
  onPartsChange,
  onPanelsPerPartChange,
}) => {
  const partsList = Array.from({ length: numberOfParts }, (_, i) => i + 1);

  // Compute total panels
  const totalPanels = partsList.reduce((acc, partNum) => acc + (panelsPerPart[partNum] || 3), 0);

  const handlePartsSelect = (num: number) => {
    onPartsChange(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Storyboard Structure</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
              {numberOfParts} Parts · {totalPanels} Total Panels
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Define the narrative phases (Parts) and allocate individual shot panels to each part.
          </p>
        </div>
      </div>

      {/* Part Count Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Number of Parts</span>
          </label>
          <span className="text-xs text-slate-400">Recommended: 3 Parts</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handlePartsSelect(num)}
              className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                numberOfParts === num
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Panels per Part Configuration Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
          Panels per Part (Dynamic Allocation)
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {partsList.map((partNum) => {
            const currentPanels = panelsPerPart[partNum] || 3;
            const defaultLabel =
              partNum === 1
                ? 'Hook & Problem'
                : partNum === numberOfParts
                ? 'Climax & CTA'
                : `Feature & Demonstration ${partNum - 1}`;

            return (
              <div
                key={partNum}
                className="p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-white/10 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
                      P{partNum}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Part {partNum}</h4>
                      <p className="text-[10px] text-slate-400">{defaultLabel}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-cyan-300">
                    {currentPanels} {currentPanels === 1 ? 'Panel' : 'Panels'}
                  </span>
                </div>

                {/* Panel Count Buttons 1-6 */}
                <div className="grid grid-cols-6 gap-1 pt-1">
                  {[1, 2, 3, 4, 5, 6].map((pCount) => (
                    <button
                      key={pCount}
                      type="button"
                      onClick={() => onPanelsPerPartChange(partNum, pCount)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        currentPanels === pCount
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                          : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {pCount}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Narrative Timeline Preview */}
      <div className="p-4 rounded-2xl bg-[#080C14] border border-white/5 space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Calculated Storyboard Architecture
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {partsList.map((partNum, idx) => {
            const count = panelsPerPart[partNum] || 3;
            return (
              <React.Fragment key={partNum}>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-white/5">
                  <span className="text-xs font-bold text-white">Part {partNum}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: count }, (_, pIdx) => (
                      <span
                        key={pIdx}
                        className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[10px] font-mono flex items-center justify-center"
                        title={`Part ${partNum} Panel ${pIdx + 1}`}
                      >
                        {pIdx + 1}
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
  );
};
