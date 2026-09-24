import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeaderHero from './components/HeaderHero';
import DropzoneUpload from './components/DropzoneUpload';
import ControlPanel from './components/ControlPanel';
import ProcessingIndicator from './components/ProcessingIndicator';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import Advertisement from './components/Advertisement';
import Footer from './components/Footer';
import { checkHealth, enhanceImage } from './services/api';
import { AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [upscaleFactor, setUpscaleFactor] = useState(2);
  const [sharpen, setSharpen] = useState(false);
  const [denoise, setDenoise] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Poll backend health status on load
  useEffect(() => {
    const verifyHealth = async () => {
      const res = await checkHealth();
      setIsBackendOnline(!!res && res.status === 'ok');
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleImageSelect = (imageData) => {
    setErrorMessage(null);
    setResultData(null);
    setSelectedImage(imageData);
  };

  const handleEnhance = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await enhanceImage({
        file: selectedImage.file,
        upscaleFactor,
        sharpen,
        denoise
      });

      if (res && res.success) {
        setResultData(res);
      } else {
        throw new Error(res?.error || 'Enhancement failed. Please try again.');
      }
    } catch (err) {
      console.error('Enhancement error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResultData(null);
    setErrorMessage(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar isBackendOnline={isBackendOnline} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner Header */}
        {!resultData && !isProcessing && <HeaderHero />}

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3 text-red-700 shadow-sm animate-shake">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm font-medium">
              <span className="font-bold block text-red-800 mb-0.5">Processing Error</span>
              {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View State 1: Upload Dropzone (When no image is selected) */}
        {!selectedImage && !isProcessing && !resultData && (
          <DropzoneUpload
            onImageSelect={handleImageSelect}
            onError={(err) => setErrorMessage(err)}
          />
        )}

        {/* View State 2: Enhancement Controls Panel (When image is uploaded) */}
        {selectedImage && !isProcessing && !resultData && (
          <ControlPanel
            imageData={selectedImage}
            upscaleFactor={upscaleFactor}
            setUpscaleFactor={setUpscaleFactor}
            sharpen={sharpen}
            setSharpen={setSharpen}
            denoise={denoise}
            setDenoise={setDenoise}
            onEnhance={handleEnhance}
            onReset={handleReset}
            isProcessing={isProcessing}
          />
        )}

        {/* View State 3: Active Processing State */}
        {isProcessing && (
          <ProcessingIndicator upscaleFactor={upscaleFactor} />
        )}

        {/* View State 4: Enhanced Result & Before/After Comparison */}
        {resultData && (
          <BeforeAfterSlider
            originalPreview={selectedImage?.previewUrl}
            enhancedBase64={resultData.enhanced_image_base64}
            resultData={resultData}
            onReset={handleReset}
          />
        )}

        {/* Ad Placement 1: Below main upload/enhancement section */}
        <Advertisement slotId="mid_page_ad" label="Sponsored Partner" />

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
