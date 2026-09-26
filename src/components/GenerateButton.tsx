import React from 'react';
import { Sparkles, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { GenerationStep } from '../types/storyboard';

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading: boolean;
  hasProductImage: boolean;
  currentStep: GenerationStep;
  stepMessage: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onGenerate,
  isLoading,
  hasProductImage,
  currentStep,
  stepMessage,
}) => {
  return (
    <>
      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {!hasProductImage ? (
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please upload a product image before generating the storyboard.</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Ready to generate 1 master Text-to-Image prompt & 1 synchronized master Text-to-Video prompt.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!hasProductImage || isLoading}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2.5 shadow-xl ${
            !hasProductImage || isLoading
              ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 text-slate-950 hover:opacity-95 shadow-cyan-500/20 hover:shadow-cyan-500/30 transform hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>{stepMessage || 'Generating Storyboard...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>GENERATE STORYBOARD PROMPTS</span>
            </>
          )}
        </button>
      </div>

      {/* Full-screen Loading Modal when generating */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 relative">
              <Loader2 className="w-8 h-8 animate-spin" />
              <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 animate-ping opacity-25" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Crafting Commercial Storyboard
              </h3>
              <p className="text-xs text-cyan-300 font-mono font-medium">
                {stepMessage || 'Processing storyboard architecture...'}
              </p>
            </div>

            {/* Step Timeline Indicator */}
            <div className="space-y-2 text-left pt-2 border-t border-white/5">
              {[
                { id: 'analyzing_product', label: 'Analyzing Product...' },
                { id: 'building_story', label: 'Building Story...' },
                { id: 'planning_panels', label: 'Planning Panels...' },
                { id: 'creating_image_prompt', label: 'Creating Image Prompt...' },
                { id: 'creating_video_prompt', label: 'Creating Video Prompt...' },
                { id: 'checking_continuity', label: 'Checking Continuity...' },
                { id: 'complete', label: 'Complete' },
              ].map((s, idx) => {
                const stepOrder = [
                  'analyzing_product',
                  'building_story',
                  'planning_panels',
                  'creating_image_prompt',
                  'creating_video_prompt',
                  'checking_continuity',
                  'complete',
                ];
                const currentIdx = stepOrder.indexOf(currentStep);
                const itemIdx = stepOrder.indexOf(s.id);
                const isPast = currentIdx > itemIdx;
                const isCurrent = currentIdx === itemIdx;

                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-2.5 text-xs py-1 transition-colors ${
                      isCurrent
                        ? 'text-cyan-300 font-semibold'
                        : isPast
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      )}
                    </div>
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
