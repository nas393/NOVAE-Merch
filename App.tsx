
import React, { useState, useCallback, useEffect } from 'react';
import { Product } from './types';
import { PRODUCTS } from './constants';
import { generateMockup } from './services/geminiService';
import { fileToBase64, dataUrlToPng } from './utils/fileUtils';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ProductSelector from './components/ProductSelector';
import PromptInput from './components/PromptInput';
import ResultDisplay from './components/ResultDisplay';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateInitialExample = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // A simple SVG logo, base64 encoded, in electric blue.
        const defaultLogoSvgBase64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGVhNWU5IiBzdHJva2Utd2lkdGg9IjEwIi8+PC9zdmc+';
        const svgDataUrl = `data:image/svg+xml;base64,${defaultLogoSvgBase64}`;
        
        const { base64Data: defaultLogoBase64, mimeType: defaultLogoMimeType } = await dataUrlToPng(svgDataUrl);

        const defaultPromptText = 'A person wearing the t-shirt in a bright, modern office setting.';
        const fullPrompt = `Create a professional, photorealistic product mockup. The product is a T-Shirt. ${defaultPromptText}. The product should prominently feature the provided logo. The scene should be well-lit and have a clean, corporate aesthetic.`;

        const imageB64 = await generateMockup(defaultLogoBase64, defaultLogoMimeType, fullPrompt);
        setGeneratedImage(`data:image/png;base64,${imageB64}`);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to generate initial example.');
      } finally {
        setIsLoading(false);
      }
    };
    generateInitialExample();
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!logoFile || !selectedProduct) {
      setError('Please upload a logo and select a product first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const { base64Data, mimeType } = await fileToBase64(logoFile);
      const visionPrompt = prompt.trim() === ''
        ? 'A clean, professional product shot on a neutral background.'
        : prompt;
      const fullPrompt = `Create a professional, photorealistic product mockup. The product is a ${selectedProduct.name}. ${visionPrompt}. The product should prominently feature the provided logo. The scene should be well-lit and have a clean, corporate aesthetic.`;
      
      const imageB64 = await generateMockup(base64Data, mimeType, fullPrompt);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [logoFile, selectedProduct, prompt]);

  const isGenerateDisabled = !logoFile || !selectedProduct || isLoading;

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">On-Demand Merch Mockups</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Generate stunning, print-ready mockups in seconds with AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* === CONTROLS PANEL === */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-8 h-fit">
            <div>
              <h2 className="text-xl font-semibold text-slate-700">1. Upload Logo</h2>
              <div className="mt-4">
                <ImageUploader onUpload={setLogoFile} />
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-8">
              <h2 className="text-xl font-semibold text-slate-700">2. Select Product</h2>
              <div className="mt-4">
                <ProductSelector
                  products={PRODUCTS}
                  selectedProduct={selectedProduct}
                  onSelect={setSelectedProduct}
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h2 className="text-xl font-semibold text-slate-700">3. Describe Vision (Optional)</h2>
              <div className="mt-4">
                <PromptInput prompt={prompt} setPrompt={setPrompt} />
              </div>
            </div>
            
            <div className="pt-6">
              <button
                onClick={handleGenerateClick}
                disabled={isGenerateDisabled}
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <SparklesIcon className="w-6 h-6 mr-3" />
                {isLoading ? 'Generating...' : 'Generate Mockup'}
              </button>
            </div>
          </div>
          
          {/* === RESULT PANEL === */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center min-h-[500px] lg:min-h-0">
            <ResultDisplay
              isLoading={isLoading}
              error={error}
              generatedImage={generatedImage}
            />
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Gemini 2.5 Flash Image</p>
      </footer>
    </div>
  );
};

export default App;
