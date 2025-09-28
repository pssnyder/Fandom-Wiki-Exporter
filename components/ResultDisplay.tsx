
import React, { useState } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';

interface ResultDisplayProps {
  markdownContent: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ markdownContent }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fandom-export.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
      <div className="flex justify-between items-center p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">Generated Markdown</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-slate-700 text-slate-300 text-sm font-medium py-1.5 px-3 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
            {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-cyan-600 text-white text-sm font-medium py-1.5 px-3 rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
          >
            <DownloadIcon className="h-4 w-4" />
            Download .md
          </button>
        </div>
      </div>
      <div className="p-4">
        <textarea
          readOnly
          value={markdownContent}
          className="w-full h-96 bg-slate-900 border border-slate-600 rounded-md p-4 text-sm font-mono text-slate-300 resize-y focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Your Markdown will appear here..."
        />
      </div>
    </div>
  );
};

export default ResultDisplay;
