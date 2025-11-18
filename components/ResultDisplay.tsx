import React, { useState } from 'react';
import { DownloadIcon, ExclamationIcon, ImageIcon, ChevronDownIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
}

const SkeletonLoader: React.FC = () => (
  <div className="bg-white p-6 rounded-2xl w-full">
    <div className="aspect-square bg-slate-200 rounded-lg animate-pulse"></div>
    <div className="h-4 bg-slate-200 rounded-md w-1/3 mx-auto mt-6"></div>
    <div className="h-10 bg-slate-200 rounded-md w-1/2 mx-auto mt-4"></div>
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, generatedImage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // FIX: Add local state for download-specific errors.
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async (format: 'png' | 'jpeg' | 'webp') => {
    if (!generatedImage) return;

    setDownloadError(null);

    if (format === 'png') {
        const a = document.createElement('a');
        a.href = generatedImage;
        a.download = `mockup.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = generatedImage;

    image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            if (format === 'jpeg') {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(image, 0, 0);
            const dataUrl = canvas.toDataURL(`image/${format}`, 0.9);
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `mockup.${format === 'jpeg' ? 'jpg' : format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };
    image.onerror = () => {
        // FIX: Use local state setter for download error instead of non-existent `setError`.
        setDownloadError("Failed to load image for conversion. Please try downloading as PNG.");
    }
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md w-full">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Generation Failed</h3>
            <p className="text-sm text-red-700 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="p-6 w-full">
        <h2 className="text-2xl font-semibold text-slate-700 text-center mb-6">Your Mockup is Ready!</h2>
        <div className="relative group">
          <img src={generatedImage} alt="Generated Mockup" className="rounded-lg w-full object-contain" />
        </div>
        <div className="text-center mt-6">
            <div className="relative inline-flex rounded-lg shadow-sm">
                <button
                    onClick={() => handleDownload('png')}
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-l-lg hover:bg-green-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Export Image
                </button>
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        className="inline-flex items-center px-3 py-3 bg-green-600 text-white rounded-r-lg border-l border-green-700 hover:bg-green-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="sr-only">Open options</span>
                        <ChevronDownIcon className="h-5 w-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                <button onClick={() => { handleDownload('png'); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                                    Export as PNG
                                </button>
                                <button onClick={() => { handleDownload('jpeg'); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                                    Export as JPG
                                </button>
                                <button onClick={() => { handleDownload('webp'); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                                    Export as WebP
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {downloadError && <p className="text-sm text-red-700 mt-2">{downloadError}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full w-full">
        <ImageIcon className="w-20 h-20 text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-600">Your mockup will appear here</h3>
        <p className="text-slate-500 mt-2 max-w-xs">
          Complete the steps on the left and click 'Generate Mockup' to see the result.
        </p>
    </div>
  );
};

export default ResultDisplay;