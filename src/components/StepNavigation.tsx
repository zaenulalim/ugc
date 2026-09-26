import React from 'react';
import { Package, Layers, Film, Video, Sliders } from 'lucide-react';

export type StepId = 'product' | 'structure' | 'story_style' | 'camera_visual' | 'video_audio';

interface StepNavigationProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  hasProductImage: boolean;
  totalPanels: number;
  partsCount: number;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
  hasProductImage,
  totalPanels,
  partsCount,
}) => {
  const steps: { id: StepId; label: string; sub: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'product',
      label: 'Product & Model',
      sub: hasProductImage ? 'Image Uploaded' : 'Product Image Required',
      icon: Package,
    },
    {
      id: 'structure',
      label: 'Storyboard Structure',
      sub: `${partsCount} Parts · ${totalPanels} Panels`,
      icon: Layers,
    },
    {
      id: 'story_style',
      label: 'Story & Ad Style',
      sub: 'Narrative Arc & Aesthetic',
      icon: Film,
    },
    {
      id: 'camera_visual',
      label: 'Camera & Visuals',
      sub: 'Angles, Moves & Lighting',
      icon: Sliders,
    },
    {
      id: 'video_audio',
      label: 'Video & Audio',
      sub: 'Aspect, Voice & CTA',
      icon: Video,
    },
  ];

  return (
    <div className="w-full bg-[#0B101D] border-b border-white/5 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="grid grid-cols-2 md:grid-cols-5 gap-2" aria-label="Storyboard Workflow Steps">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isProductStep = step.id === 'product';

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep(step.id)}
                className={`relative flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all group ${
                  isActive
                    ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-950/40 border-white/5 hover:bg-slate-900/60 hover:border-white/10'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : isProductStep && !hasProductImage
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500">
                      0{idx + 1}
                    </span>
                    <p
                      className={`text-xs font-semibold truncate ${
                        isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  <p
                    className={`text-[11px] truncate font-sans ${
                      isProductStep && !hasProductImage
                        ? 'text-amber-400/90 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.sub}
                  </p>
                </div>

                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
