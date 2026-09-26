import React from 'react';
import { Sparkles, Sliders, Maximize2, Zap, RefreshCw, FileText, Image as ImageIcon } from 'lucide-react';

export default function ControlPanel({
  imageData,
  upscaleFactor,
  setUpscaleFactor,
  sharpen,
  setSharpen,
  denoise,
  setDenoise,
  onEnhance,
  onReset,
  isProcessing
}) {
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left column: Uploaded Image Preview & Metadata */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full aspect-4/3 max-h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
            <img
              src={imageData.previewUrl}
              alt="Uploaded Preview"
              className="w-full h-full object-contain p-2"
            />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
              Original Preview
            </div>
            <button
              onClick={onReset}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 hover:text-red-600 p-1.5 rounded-lg shadow-sm backdrop-blur-xs transition-all text-xs flex items-center gap-1 font-medium"
              title="Upload a different image"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
          </div>

          {/* Image info metadata card */}
          <div className="w-full mt-4 bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-2 truncate">
              <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate max-w-[140px]" title={imageData.filename}>
                {imageData.filename}
              </span>
            </div>
            <div className="flex items-center space-x-3 shrink-0 text-slate-500 font-mono">
              <span>{imageData.width} × {imageData.height}px</span>
              <span>•</span>
              <span>{formatBytes(imageData.sizeBytes)}</span>
            </div>
          </div>
        </div>

        {/* Right column: Enhancement Settings & Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sliders className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-extrabold text-slate-900">
                Enhancement Settings
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Configure your desired AI upscaling multiplier, noise reduction, and edge sharpening preferences.
            </p>

            <div className="space-y-5">
              
              {/* 1. Upscale Multiplier selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  AI Upscale Multiplier
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setUpscaleFactor && setUpscaleFactor(2)}
                    className="py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 border bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20 cursor-default"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>2× Scale</span>
                    <span className="text-[10px] font-mono opacity-80">({imageData.width * 2}×{imageData.height * 2})</span>
                  </button>
                </div>
              </div>

              {/* 2. Denoise and Sharpen Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Denoise Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                      AI Denoise
                    </span>
                    <span className="text-[11px] text-slate-500">Smooth out grainy noise</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={denoise}
                      onChange={(e) => setDenoise(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Sharpen Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-500" />
                      Smart Sharpen
                    </span>
                    <span className="text-[11px] text-slate-500">Restore fine edge details</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sharpen}
                      onChange={(e) => setSharpen(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

              </div>

            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={onEnhance}
              className="w-full py-4 px-6 rounded-2xl gradient-bg text-white font-extrabold text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5 animate-spin-slow" />
              <span>Enhance Image</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
