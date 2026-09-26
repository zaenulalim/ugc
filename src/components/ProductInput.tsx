import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, Plus, X, AlertCircle, Sparkles } from 'lucide-react';
import { SAMPLE_PRESETS } from '../constants/options';

interface ProductInputProps {
  productImage: string;
  productImageName: string;
  productName: string;
  productDescription: string;
  sellingPoints: string[];
  targetAudience: string;
  onImageChange: (dataUrl: string, fileName: string) => void;
  onImageRemove: () => void;
  onNameChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onSellingPointsChange: (points: string[]) => void;
  onTargetAudienceChange: (val: string) => void;
  onLoadPreset: (presetId: string) => void;
}

export const ProductInput: React.FC<ProductInputProps> = ({
  productImage,
  productImageName,
  productName,
  productDescription,
  sellingPoints,
  targetAudience,
  onImageChange,
  onImageRemove,
  onNameChange,
  onDescriptionChange,
  onSellingPointsChange,
  onTargetAudienceChange,
  onLoadPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

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

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !sellingPoints.includes(trimmed)) {
      onSellingPointsChange([...sellingPoints, trimmed]);
      setNewTagInput('');
    }
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onSellingPointsChange(sellingPoints.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Header section with quick sample fill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Product Definition</span>
            <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
              Required
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Upload your commercial product photograph and specify key product attributes.
          </p>
        </div>

        {/* Quick sample chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Try sample product:</span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onLoadPreset(preset.id)}
              className="text-xs font-medium text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{preset.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload Area (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Product Image <span className="text-rose-400">*</span>
            </label>
            {productImage && (
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">
                {productImageName || 'image.png'}
              </span>
            )}
          </div>

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

          {productImage ? (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 shadow-xl group aspect-square flex items-center justify-center p-3">
              <img
                src={productImage}
                alt="Product preview"
                className="w-full h-full object-contain rounded-xl"
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

              <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] text-slate-300 font-mono">
                Primary Reference
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
                  ? 'border-cyan-400 bg-cyan-950/20'
                  : 'border-white/10 hover:border-cyan-500/50 hover:bg-slate-900/50 bg-slate-950/40'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                Upload Product Image
              </p>
              <p className="text-xs text-slate-400 max-w-[200px] mb-3">
                Drag & drop or click to browse JPG, PNG, WEBP
              </p>
              <span className="px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 rounded-lg">
                Browse Files
              </span>
            </div>
          )}

          {!productImage && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>A product image is required to generate the storyboard. AI will analyze its materials, logo, and physical dimensions.</span>
            </div>
          )}
        </div>

        {/* Right Column: Product Metadata (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. AeroPulse Velocity Carbon Runner"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
              Product Description
            </label>
            <textarea
              rows={3}
              value={productDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="e.g. Ultralight marathon running shoe with carbon propulsion plate, breathable mesh, and high-energy return cushion."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
            />
          </div>

          {/* Key Selling Points (Dynamic tag adder) */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
              Key Selling Points (USPs)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                placeholder="e.g. Carbon propulsion plate"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-white/10 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Tags display */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
              {sellingPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/60 text-slate-200 text-xs"
                >
                  <span>{point}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(point)}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {sellingPoints.length === 0 && (
                <span className="text-xs text-slate-400 italic">
                  No selling points added yet. Type a point and click Add or press Enter.
                </span>
              )}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => onTargetAudienceChange(e.target.value)}
              placeholder="e.g. Marathon runners, fitness enthusiasts aged 20-35"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
