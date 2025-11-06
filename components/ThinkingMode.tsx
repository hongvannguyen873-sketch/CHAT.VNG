
import React, { useState } from 'react';
import { generateWithThinking } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { BrainIcon } from './Icons';

const ThinkingMode: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("Please enter a complex query.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await generateWithThinking(prompt);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gemini-light-dark rounded-lg flex flex-col h-full">
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-2 text-gemini-purple flex items-center">
            <BrainIcon className="w-6 h-6 mr-2" />
            Thinking Mode
        </h3>
        <p className="text-sm text-gemini-light-grey mb-4">
            For complex reasoning, coding, or mathematical problems. Powered by Gemini 2.5 Pro with maximum thinking budget.
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a complex query..."
          className="w-full p-3 rounded-lg bg-gemini-grey border border-gemini-light-grey focus:outline-none focus:ring-2 focus:ring-gemini-purple resize-y"
          rows={5}
          disabled={isLoading}
        />
        <div className="flex justify-end my-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 rounded-full bg-gemini-purple text-white font-semibold disabled:bg-gemini-light-grey transition-colors flex items-center"
          >
            {isLoading ? <><LoadingSpinner size="5"/> <span className="ml-2">Thinking...</span></> : 'Submit Query'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full mt-4 bg-gemini-grey/20 rounded-lg overflow-y-auto p-4">
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <LoadingSpinner size="12" />
                <p className="mt-4 text-gemini-light-grey">Gemini is thinking deeply...</p>
                <p className="text-sm text-gemini-light-grey">(This may take a moment for complex queries)</p>
            </div>
        )}
        {error && <p className="text-red-400 p-4">{error}</p>}
        {response && (
            <pre className="whitespace-pre-wrap text-gemini-text font-sans">{response}</pre>
        )}
        {!isLoading && !error && !response && (
            <div className="flex items-center justify-center h-full">
                <p className="text-gemini-light-grey">The response to your complex query will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ThinkingMode;
