import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import type { ChatMessage } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { SendIcon, ErrorIcon } from './Icons';

const ChatBot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(createChatSession('gemini-2.5-flash'));
    setMessages([{ role: 'model', text: 'Hello! How can I help you today?' }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chat || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: input });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gemini-light-dark rounded-lg p-4">
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-2xl p-3 rounded-2xl mb-2 ${msg.role === 'user' ? 'bg-gemini-blue text-white' : 'bg-gemini-grey text-gemini-text'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gemini-grey p-3 rounded-2xl mb-2">
              <LoadingSpinner size="5" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-400 flex items-center justify-between" role="alert" aria-live="assertive">
            <div className="flex items-center">
                <ErrorIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
            </div>
            <button 
                onClick={() => setError(null)} 
                className="p-1 rounded-full hover:bg-red-500/20 transition-colors"
                aria-label="Dismiss error message"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
      )}

      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-full bg-gemini-grey border border-gemini-light-grey focus:outline-none focus:ring-2 focus:ring-gemini-blue"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="ml-3 p-3 rounded-full bg-gemini-blue text-white disabled:bg-gemini-light-grey transition-colors"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;