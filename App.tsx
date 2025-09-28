
import React, { useState, useCallback, useRef } from 'react';
import type { ProcessStatus } from './types';
import { getAllPageTitles, getPageHtml, getApiUrlFromWikiUrl } from './services/fandomService';
import UrlInput from './components/UrlInput';
import ProgressBar from './components/ProgressBar';
import ResultDisplay from './components/ResultDisplay';
import { BookOpenIcon } from './components/icons/BookOpenIcon';

// Declare TurndownService for TypeScript since it's loaded from a CDN
declare var TurndownService: any;
declare var turndownPluginGfm: any; // For GFM (tables, etc.)

export default function App() {
  const [wikiUrl, setWikiUrl] = useState<string>('https://startupcompany.fandom.com/wiki/Startup_Company_Wiki');
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 1, message: '' });
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const turndownServiceRef = useRef<any>(null);

  const handleGenerate = useCallback(async () => {
    setError(null);
    setMarkdownContent('');
    setProgress({ current: 0, total: 1, message: '' });

    if (!wikiUrl) {
      setError('Please enter a Fandom wiki URL.');
      return;
    }

    if (!turndownServiceRef.current) {
        turndownServiceRef.current = new TurndownService({
          headingStyle: 'atx',
          codeBlockStyle: 'fenced'
        });
        // Use the GFM plugin to handle tables and other GFM features
        if (typeof turndownPluginGfm !== 'undefined') {
          turndownServiceRef.current.use(turndownPluginGfm.gfm);
        } else {
            console.warn("Turndown GFM plugin not loaded. Tables might not be formatted correctly.");
        }
    }

    try {
      const apiUrl = getApiUrlFromWikiUrl(wikiUrl);
      if (!apiUrl) {
        throw new Error("Invalid Fandom URL. It should look like 'https://subdomain.fandom.com/...'");
      }

      setStatus('fetching_pages');
      setProgress({ current: 0, total: 1, message: 'Discovering all pages on the wiki...' });
      const pageTitles = await getAllPageTitles(apiUrl);
      
      if (pageTitles.length === 0) {
        throw new Error("Could not find any pages on this wiki.");
      }

      setStatus('fetching_content');
      setProgress(prev => ({ ...prev, total: pageTitles.length }));

      let combinedMarkdown = `# ${wikiUrl.split('/')[2].split('.')[0]} Wiki Export\n\n`;

      for (let i = 0; i < pageTitles.length; i++) {
        const title = pageTitles[i];
        setProgress({ 
            current: i + 1, 
            total: pageTitles.length, 
            message: `Processing page ${i + 1}/${pageTitles.length}: ${title}` 
        });

        const htmlContent = await getPageHtml(apiUrl, title);
        const pageMarkdown = turndownServiceRef.current.turndown(htmlContent);
        combinedMarkdown += `\n\n---\n\n## ${title}\n\n${pageMarkdown}`;
      }
      
      setMarkdownContent(combinedMarkdown);
      setStatus('success');
      setProgress(prev => ({ ...prev, message: `Successfully exported ${pageTitles.length} pages!` }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(errorMessage);
      setError(errorMessage);
      setStatus('error');
    }
  }, [wikiUrl]);

  const isLoading = status === 'fetching_pages' || status === 'fetching_content';

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <BookOpenIcon className="h-10 w-10 text-cyan-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Fandom Wiki Exporter</h1>
          </div>
          <p className="text-lg text-slate-400">Convert any Fandom wiki into a single Markdown file.</p>
        </header>

        <main className="space-y-6">
          <UrlInput
            wikiUrl={wikiUrl}
            onUrlChange={setWikiUrl}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-center" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {(isLoading || status === 'success') && (
            <ProgressBar 
              current={progress.current} 
              total={progress.total} 
              message={progress.message} 
              status={status} 
            />
          )}

          {status === 'success' && markdownContent && (
            <ResultDisplay markdownContent={markdownContent} />
          )}
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Built with React, Tailwind CSS, and the MediaWiki API.</p>
        </footer>
      </div>
    </div>
  );
}