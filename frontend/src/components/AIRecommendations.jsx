import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export default function AIRecommendations({ recommendations = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  const getCardStyle = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-red-950/30 border-red-500/30 text-red-200';
      case 'success':
        return 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200';
      default:
        return 'bg-blue-950/30 border-blue-500/30 text-blue-200';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center space-x-2 pb-5 border-b border-slate-800">
        <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-white">6. AI Planning Recommendations Feed</h2>
          <p className="text-xs text-slate-400">Explainable AI decisions for material allocation, capacity load, & shift scheduling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {recommendations.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-4 border flex flex-col justify-between space-y-3 shadow-md hover:scale-[1.01] transition duration-200 ${getCardStyle(item.type)}`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                {getIcon(item.type)}
                <span className="text-xs font-bold uppercase tracking-wider">{item.title}</span>
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-90">{item.message}</p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold opacity-80">
              <span>Action Recommendation:</span>
              <span className="flex items-center gap-1 hover:underline cursor-pointer">
                {item.action || 'View Details'} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
