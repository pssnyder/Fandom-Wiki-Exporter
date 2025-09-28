
import React from 'react';

interface UrlInputProps {
  wikiUrl: string;
  onUrlChange: (url: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ wikiUrl, onUrlChange, onGenerate, isLoading }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
      <label htmlFor="wiki-url" className="block text-sm font-medium text-slate-300 mb-2">
        Fandom Wiki URL
      </label>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          id="wiki-url"
          type="url"
          value={wikiUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="e.g., https://terraria.fandom.com/wiki/Terraria_Wiki"
          disabled={isLoading}
          className="flex-grow bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-50"
        />
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="flex items-center justify-center bg-cyan-600 text-white font-bold py-2 px-6 rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Generate Markdown'
          )}
        </button>
      </div>
    </div>
  );
};

export default UrlInput;
