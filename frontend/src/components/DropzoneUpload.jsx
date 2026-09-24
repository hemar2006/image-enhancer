import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, FileCheck, FileCode } from 'lucide-react';

const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

export default function DropzoneUpload({ onImageSelect, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      onError(`File size exceeds ${MAX_SIZE_MB}MB. Please select a smaller image.`);
      return;
    }

    // Validate extension & mime type
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const isValidType = ALLOWED_TYPES.includes(file.type.toLowerCase()) || ALLOWED_EXTS.includes(ext);

    if (!isValidType) {
      onError(`Unsupported file format "${ext || file.type}". Supported formats are JPG, JPEG, PNG, and WebP.`);
      return;
    }

    // Read image preview and dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onImageSelect({
          file,
          previewUrl: e.target.result,
          filename: file.name,
          width: img.width,
          height: img.height,
          sizeBytes: file.size,
          type: file.type || 'image/png'
        });
      };
      img.onerror = () => {
        onError('The selected file appears to be corrupted or invalid. Please try another image.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 group ${
          isDragging
            ? 'border-blue-500 bg-blue-50/80 scale-[1.01] shadow-xl shadow-blue-500/10'
            : 'border-slate-300 hover:border-blue-400 bg-white/90 hover:bg-slate-50/80 shadow-sm hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Upload Icon Badge */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            isDragging ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
          }`}>
            <UploadCloud className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Drag & drop your image here
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              or click anywhere to browse from your computer
            </p>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 group-hover:translate-y-[-1px]"
          >
            <ImageIcon className="w-4 h-4" />
            Upload Image
          </button>

          {/* Supported Format badges */}
          <div className="pt-4 border-t border-slate-200/60 w-full max-w-md flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Supported formats:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium">JPG</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium">PNG</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium">WebP</span>
            <span className="text-slate-400 font-medium ml-1">• Max {MAX_SIZE_MB}MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
