import React, { useState } from 'react';
import {
  CAMERA_ANGLES,
  CAMERA_MOVEMENTS,
  VISUAL_STYLES,
  LIGHTING_STYLES,
  ENVIRONMENTS,
} from '../constants/options';
import { Video, Sun, MapPin, Eye, Film } from 'lucide-react';

interface CameraAndVisualProps {
  cameraAngles: string[];
  cameraMovement: string;
  visualStyle: string;
  lighting: string;
  environment: string;
  customEnvironment?: string;
  onCameraAnglesChange: (angles: string[]) => void;
  onCameraMovementChange: (val: string) => void;
  onVisualStyleChange: (val: string) => void;
  onLightingChange: (val: string) => void;
  onEnvironmentChange: (val: string) => void;
  onCustomEnvironmentChange: (val: string) => void;
}

export const CameraAndVisual: React.FC<CameraAndVisualProps> = ({
  cameraAngles,
  cameraMovement,
  visualStyle,
  lighting,
  environment,
  customEnvironment = '',
  onCameraAnglesChange,
  onCameraMovementChange,
  onVisualStyleChange,
  onLightingChange,
  onEnvironmentChange,
  onCustomEnvironmentChange,
}) => {
  const toggleAngle = (angle: string) => {
    if (cameraAngles.includes(angle)) {
      if (cameraAngles.length > 1) {
        onCameraAnglesChange(cameraAngles.filter((a) => a !== angle));
      }
    } else {
      onCameraAnglesChange([...cameraAngles, angle]);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. CAMERA ANGLES (Multi-select) */}
      <div className="space-y-3">
        <div className="pb-2 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Camera Angles</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                Multi-Select ({cameraAngles.length} selected)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Select one or more angles. AI distributes them contextually (e.g. Close Up for product details, Medium Shot for usage).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {CAMERA_ANGLES.map((angle) => {
            const isSelected = cameraAngles.includes(angle);
            return (
              <button
                key={angle}
                type="button"
                onClick={() => toggleAngle(angle)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm font-semibold'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {angle}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CAMERA MOVEMENT */}
      <div className="space-y-3">
        <div className="pb-2 border-b border-white/5">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-400" />
            <span>Camera Movement</span>
          </h2>
          <p className="text-xs text-slate-400">
            Defines kinetic motion style applied throughout video generation pacing.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {CAMERA_MOVEMENTS.map((mov) => {
            const isSelected = cameraMovement === mov;
            return (
              <button
                key={mov}
                type="button"
                onClick={() => onCameraMovementChange(mov)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  isSelected
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/60 shadow-sm font-semibold'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {mov}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. VISUAL STYLE & LIGHTING (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Style */}
        <div className="space-y-3">
          <div className="pb-2 border-b border-white/5">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>Visual Style</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {VISUAL_STYLES.map((vs) => {
              const isSelected = visualStyle === vs;
              return (
                <button
                  key={vs}
                  type="button"
                  onClick={() => onVisualStyleChange(vs)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all truncate ${
                    isSelected
                      ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/60 font-semibold'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {vs}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lighting */}
        <div className="space-y-3">
          <div className="pb-2 border-b border-white/5">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Lighting</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LIGHTING_STYLES.map((ls) => {
              const isSelected = lighting === ls;
              return (
                <button
                  key={ls}
                  type="button"
                  onClick={() => onLightingChange(ls)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all truncate ${
                    isSelected
                      ? 'bg-amber-950/40 text-amber-300 border-amber-500/60 font-semibold'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {ls}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. ENVIRONMENT / LOCATION */}
      <div className="space-y-3">
        <div className="pb-2 border-b border-white/5">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Environment & Location</span>
          </h2>
          <p className="text-xs text-slate-400">
            The physical setting where product engagement and narrative take place.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {ENVIRONMENTS.map((env) => {
            const isSelected = environment === env;
            return (
              <button
                key={env}
                type="button"
                onClick={() => onEnvironmentChange(env)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/60 font-semibold'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {env}
              </button>
            );
          })}
        </div>

        {environment === 'Custom' && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/40 space-y-2 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Describe Custom Environment
            </label>
            <textarea
              rows={2}
              value={customEnvironment}
              onChange={(e) => onCustomEnvironmentChange(e.target.value)}
              placeholder="e.g. Modern minimalist rooftop garden overlooking Tokyo skyline during blue hour."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
