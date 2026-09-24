import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RefreshCw, Sparkles, Maximize2, MoveHorizontal, Check, Zap } from 'lucide-react';

export default function BeforeAfterSlider({
  originalPreview,
  enhancedBase64,
  resultData,
  onReset
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = enhancedBase64;
    const originalName = resultData?.original_filename || 'image';
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const factor = resultData?.upscale_factor || 2;
    link.download = `enhanced_${factor}x_${nameWithoutExt}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Enhancement Complete
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Processed in {resultData?.processing_time_seconds || '0.5'}s
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Before & After Comparison
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Download Enhanced</span>
          </button>
        </div>
      </div>

      {/* Interactive Draggable Slider Canvas */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
        className="relative w-full aspect-16/10 sm:aspect-16/9 rounded-2xl overflow-hidden select-none cursor-ew-resize bg-slate-950 border border-slate-200 shadow-inner group"
      >
        {/* Right Layer: ENHANCED Image (Full background) */}
        <img
          src={enhancedBase64}
          alt="Enhanced Result"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Left Layer: ORIGINAL Image (Clipped by slider position) */}
        <div
          className="absolute top-0 left-0 bottom-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalPreview}
            alt="Original Upload"
            className="absolute top-0 left-0 max-w-none h-full object-contain"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%'
            }}
          />
        </div>

        {/* Original Badge (Left side) */}
        <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 shadow-md flex items-center space-x-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <span>Original ({resultData?.original_width}×{resultData?.original_height}px)</span>
        </div>

        {/* Enhanced Badge (Right side) */}
        <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-400/30 shadow-md flex items-center space-x-2 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Enhanced {resultData?.upscale_factor}× ({resultData?.enhanced_width}×{resultData?.enhanced_height}px)</span>
        </div>

        {/* Central Vertical Draggable Handle Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-blue-600 text-blue-600 shadow-xl flex items-center justify-center">
            <MoveHorizontal className="w-5 h-5" />
          </div>
        </div>

        {/* Drag Hint Banner on hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-medium px-4 py-1.5 rounded-full border border-white/10 opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none">
          Drag slider left/right to compare details
        </div>
      </div>

      {/* Detailed Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs">
        <div>
          <span className="text-slate-400 font-semibold block">Original Size</span>
          <span className="text-slate-800 font-mono font-bold">{formatBytes(resultData?.original_size_bytes)}</span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block">Enhanced Size</span>
          <span className="text-blue-600 font-mono font-bold">{formatBytes(resultData?.enhanced_size_bytes)}</span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block">Upscale Multiplier</span>
          <span className="text-slate-800 font-extrabold">{resultData?.upscale_factor}× AI Super-Resolution</span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block">Applied Filters</span>
          <span className="text-slate-800 font-medium">
            {[
              resultData?.denoise_applied ? 'Denoise' : null,
              resultData?.sharpen_applied ? 'Sharpen' : null,
            ].filter(Boolean).join(' + ') || 'Standard Upscale'}
          </span>
        </div>
      </div>

    </div>
  );
}
