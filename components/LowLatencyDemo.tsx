
import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import { SendIcon } from './Icons';

const LowLatencyDemo: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');

  useEffect(() => {
    setChat(createChatSession('gemini-2.5-flash-lite'));
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chat || isLoading) return;

    setIsLoading(true);
    setStreamingResponse('');

    try {
      const responseStream = await chat.sendMessageStream({ message: input });
      for await (const chunk of responseStream) {
        setStreamingResponse(prev => prev + chunk.text);
      }
    } catch (error) {
      console.error(error);
      setStreamingResponse('Sorry, something went wrong while streaming.');
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gemini-light-dark rounded-lg p-4">
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gemini-grey/20 rounded-lg min-h-[200px]">
        <p className="whitespace-pre-wrap text-gemini-text">{streamingResponse}</p>
        {isLoading && !streamingResponse && <p className="text-gemini-light-grey">Waiting for response...</p>}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask something for a fast, streaming response..."
          className="flex-1 p-3 rounded-full bg-gemini-grey border border-gemini-light-grey focus:outline-none focus:ring-2 focus:ring-gemini-purple"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="ml-3 p-3 rounded-full bg-gemini-purple text-white disabled:bg-gemini-light-grey transition-colors"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default LowLatencyDemo;
