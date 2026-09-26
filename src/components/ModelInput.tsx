import React, { useRef, useState } from 'react';
import { UploadCloud, User, Trash2, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { SAMPLE_MODEL } from '../constants/options';

interface ModelInputProps {
  modelImage?: string;
  modelImageName?: string;
  hasModel: boolean;
  onImageChange: (dataUrl: string, fileName: string) => void;
  onImageRemove: () => void;
  onUseSampleModel: () => void;
}

export const ModelInput: React.FC<ModelInputProps> = ({
  modelImage,
  modelImageName,
  hasModel,
  onImageChange,
  onImageRemove,
  onUseSampleModel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid JPG, PNG, or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageChange(result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Model & Character Reference</span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded">
              Optional
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Upload an actor or creator photo to maintain exact facial and physical identity throughout all storyboard panels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Sample model:</span>
          <button
            type="button"
            onClick={onUseSampleModel}
            className="text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Mia Lin (Creator)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Upload Area (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {hasModel && modelImage ? (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 shadow-xl group aspect-square flex items-center justify-center p-3">
              <img
                src={modelImage}
                alt="Model preview"
                className="w-full h-full object-cover rounded-xl"
              />

              {/* Hover overlay with action buttons */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 shadow-lg flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={onImageRemove}
                  className="px-3.5 py-2 text-xs font-medium text-white bg-rose-600/90 hover:bg-rose-500 rounded-xl shadow-lg flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>

              <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] text-indigo-300 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Identity Locked
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all aspect-square flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-950/20'
                  : 'border-white/10 hover:border-indigo-500/50 hover:bg-slate-900/50 bg-slate-950/40'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <User className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                Upload Model Reference
              </p>
              <p className="text-xs text-slate-400 max-w-[220px] mb-3">
                Optional: Upload a portrait or creator selfie for character persistence
              </p>
              <span className="px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 rounded-lg">
                Browse Files
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Consistency Policy Guide (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
            <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Character Continuity Engine
            </h3>

            {hasModel ? (
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Model Reference Active
                </p>
                <p>
                  AI will analyze this reference image and enforce strict visual continuity instructions across all storyboard panels:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Preserve identical facial bone structure & ethnic presentation</li>
                  <li>Maintain exact hairstyle, hair color, and texture</li>
                  <li>Maintain skin tone, micro-textures, and approximate age</li>
                  <li>Retain wardrobe continuity, color scheme, and body proportions</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <p className="text-slate-300 font-medium">
                  No Model Image Provided (Audience Persona Mode)
                </p>
                <p>
                  If no image is uploaded, AI will automatically design a relatable, charismatic commercial protagonist aligned with your Target Audience specification, while still keeping their identity 100% consistent across all storyboard panels.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
