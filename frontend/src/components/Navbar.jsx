import React from 'react';
import { Sparkles, Image as ImageIcon, Cpu, ShieldCheck } from 'lucide-react';

export default function Navbar({ isBackendOnline }) {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              Image<span className="gradient-text">Enhancer</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200/60 ml-2">
              AI v2.0
            </span>
          </div>
        </div>

        {/* Status indicator & Tech Badges */}
        <div className="flex items-center space-x-4 text-xs font-medium">
          <div className="hidden md:flex items-center space-x-3 text-slate-500">
            <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Private (In-Memory)
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              Neural Upscaler
            </span>
          </div>

          {/* Backend Status Dot */}
          <div 
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isBackendOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : 'bg-amber-50 text-amber-700 border-amber-200/80'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isBackendOnline ? 'AI Server Ready' : 'Connecting Server...'}</span>
          </div>
        </div>

      </div>
    </header>
  );
}
