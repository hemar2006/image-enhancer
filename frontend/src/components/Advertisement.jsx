import React, { useEffect, useRef, useState } from 'react';

export default function Advertisement({ slotId = 'default', label = 'Sponsored Advertisement' }) {
  const containerRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Avoid duplicate script insertion if already injected in this container
    if (container.querySelector(`script[data-ad-slot="${slotId}"]`)) {
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = 'https://pl23837600.profitableratecpmnetwork.com/06/bd/63/06bd6309bb90abb70e86febe8ddde6f7.js';
      script.async = true;
      script.setAttribute('data-ad-slot', slotId);

      script.onload = () => {
        setLoaded(true);
      };

      script.onerror = () => {
        setLoadError(true);
      };

      container.appendChild(script);
    } catch (err) {
      console.warn('Ad script loading issue:', err);
      setLoadError(true);
    }

    return () => {
      // Clean up script if component unmounts
      if (container) {
        const injectedScript = container.querySelector(`script[data-ad-slot="${slotId}"]`);
        if (injectedScript) {
          try {
            container.removeChild(injectedScript);
          } catch (e) {
            // ignore cleanup errors
          }
        }
      }
    };
  }, [slotId]);

  return (
    <div className="w-full my-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-100/90 border border-slate-200/80 rounded-xl p-4 shadow-sm text-center transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2 px-1">
          <span className="uppercase tracking-wider text-[10px] bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded">
            {label}
          </span>
          <span className="text-[11px] text-slate-400">Ad</span>
        </div>

        {/* Ad script container */}
        <div 
          ref={containerRef}
          className="min-h-[90px] w-full flex items-center justify-center overflow-hidden rounded-lg bg-white/60 border border-dashed border-slate-300 p-2"
        >
          {loadError ? (
            <div className="text-xs text-slate-400 py-4">
              <span>Advertisement space ({slotId})</span>
            </div>
          ) : !loaded ? (
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 py-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <span>Loading ad placement...</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
