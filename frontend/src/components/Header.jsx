import React from 'react';
import { Cpu, RefreshCw, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Header({ onRefresh, isRefreshing, plmStatus }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight">AI ERP & Production Planning Assistant</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  PLM v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">College Mechanical Engineering Project Demo</p>
            </div>
          </div>

          {/* CRITICAL REQUIRED DEMO BANNER */}
          <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-300 tracking-wide uppercase">
              PLM Integration: DEMO / MOCK
            </span>
          </div>

          {/* Controls & PLM Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-300 font-medium">PLM Status:</span>
              <span className="text-emerald-400 font-semibold">{plmStatus?.mode || 'MOCK'}</span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition duration-200 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
              <span>Refresh App</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
