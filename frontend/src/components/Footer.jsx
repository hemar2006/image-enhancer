import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';
import Advertisement from './Advertisement';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 text-xs py-10 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Ad Placement 2: Bottom of Page */}
        <Advertisement slotId="footer_ad" label="Sponsored Links" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                Image<span className="text-blue-400">Enhancer</span>
              </span>
              <p className="text-[11px] text-slate-500">
                AI-powered image upscaling, sharpening and noise reduction.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Privacy Guaranteed: Images are processed in-memory and deleted immediately.</span>
          </div>

          <div className="text-slate-500 text-[11px] text-center md:text-right">
            <span>&copy; {new Date().getFullYear()} ImageEnhancer. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
