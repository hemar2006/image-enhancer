import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

const STEPS = [
  'Decoding image & validating format...',
  'Applying AI noise reduction pass...',
  'Processing 2× neural super-resolution...',
  'Refining edge contrast & sharpening details...',
  'Packaging high-definition PNG output...'
];

export default function ProcessingIndicator({ upscaleFactor }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto my-12 bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl text-center space-y-6">
      
      {/* Animated Spinner Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">
          Enhancing Your Image ({upscaleFactor}× Scale)
        </h3>
        <p className="text-sm text-slate-500">
          Our AI neural model is upscaling and restoring image details. Please wait a moment.
        </p>
      </div>

      {/* Progress Steps Feed */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 max-w-md mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 text-xs font-medium transition-all ${
                isDone
                  ? 'text-emerald-600 font-semibold'
                  : isCurrent
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
