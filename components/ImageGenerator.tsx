
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import type { AspectRatio } from '../types';
import LoadingSpinner from './LoadingSpinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const aspectRatios: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImage(prompt, aspectRatio);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gemini-light-dark rounded-lg flex flex-col items-center h-full">
      <div className="w-full max-w-2xl">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full p-3 rounded-lg bg-gemini-grey border border-gemini-light-grey focus:outline-none focus:ring-2 focus:ring-gemini-blue resize-none"
          rows={3}
          disabled={isLoading}
        />
        <div className="flex flex-wrap items-center justify-between my-4 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-gemini-text">Aspect Ratio:</label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${aspectRatio === ratio ? 'bg-gemini-blue text-white' : 'bg-gemini-grey hover:bg-gemini-light-grey'}`}
                  disabled={isLoading}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-2 rounded-full bg-gemini-purple text-white font-semibold disabled:bg-gemini-light-grey transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full max-w-2xl mt-4 flex items-center justify-center bg-gemini-grey/20 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="text-center">
            <LoadingSpinner size="12" />
            <p className="mt-4 text-gemini-light-grey">Creating your masterpiece...</p>
          </div>
        )}
        {error && <p className="text-red-400 p-4">{error}</p>}
        {imageUrl && (
          <img src={imageUrl} alt="Generated" className="object-contain max-h-full max-w-full" />
        )}
        {!isLoading && !error && !imageUrl && (
            <p className="text-gemini-light-grey">Your generated image will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
