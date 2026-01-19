import React, { useState } from 'react';
import { generateWithThinking } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { BrainIcon } from './Icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
             <ReactMarkdown
                children={response}
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-3 border-b border-gemini-grey pb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                    a: ({node, ...props}) => <a className="text-gemini-blue hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-8 mb-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-8 mb-4" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gemini-light-grey pl-4 italic text-gemini-light-grey my-4" {...props} />,
                    pre: ({node, children, ...props}) => {
                        const codeBlock = React.Children.toArray(children).find(
                            (child) => React.isValidElement(child) && child.type === 'code'
                        ) as React.ReactElement | undefined;

                        if (codeBlock) {
                            const lang = codeBlock.props.className?.replace('language-', '') || 'text';
                            const code = String(codeBlock.props.children).replace(/\n$/, '');

                            return (
                                <div className="bg-gemini-dark rounded-lg my-4 overflow-hidden border border-gemini-grey">
                                    <div className="flex items-center justify-between px-4 py-1 bg-gemini-grey">
                                        <span className="text-gemini-light-grey text-xs capitalize">{lang}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(code)}
                                            className="text-gemini-light-grey hover:text-gemini-text text-xs font-sans p-1 rounded hover:bg-gemini-light-grey/20 transition-colors"
                                            aria-label="Copy code to clipboard"
                                        >
                                            Copy code
                                        </button>
                                    </div>
                                    <pre className="p-4 overflow-x-auto" {...props}>
                                        {children}
                                    </pre>
                                </div>
                            );
                        }
                        return <pre className="bg-gemini-dark rounded-lg my-4 p-4 overflow-x-auto border border-gemini-grey" {...props}>{children}</pre>;
                    },
                    code({node, inline, className, children, ...props}) {
                        return !inline ? (
                            <code className={`${className} font-mono text-sm`} {...props}>
                                {children}
                            </code>
                        ) : (
                            <code className="bg-gemini-grey text-gemini-purple rounded px-1.5 py-1 font-mono text-sm" {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            />
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
