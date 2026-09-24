import React from 'react';
import { Zap, Maximize2, Sliders, Shield } from 'lucide-react';

export default function HeaderHero() {
  return (
    <section className="text-center pt-8 pb-6 px-4 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-6 shadow-sm">
        <Zap className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
        <span>Next-Gen Image Enhancement Engine</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
        Enhance your images with <span className="gradient-text">AI-powered upscaling</span>, sharpening and noise reduction.
      </h1>

      <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
        Turn blurry or low-resolution photos into crystal-clear images up to 4× larger in seconds. Completely free & processed locally.
      </p>

      {/* Feature highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
        <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">2× & 4× Scale</div>
            <div className="text-[11px] text-slate-500">Sub-pixel detail</div>
          </div>
        </div>

        <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">AI Denoise</div>
            <div className="text-[11px] text-slate-500">Noise reduction</div>
          </div>
        </div>

        <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Edge Sharpen</div>
            <div className="text-[11px] text-slate-500">Unsharp masking</div>
          </div>
        </div>

        <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Private</div>
            <div className="text-[11px] text-slate-500">No cloud saving</div>
          </div>
        </div>
      </div>
    </section>
  );
}
