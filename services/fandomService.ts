
import type { AllPagesApiResponse, ParseApiResponse } from '../types';

/**
 * Validates a Fandom wiki URL and extracts the base for API calls.
 * @param wikiUrl The full URL of the Fandom wiki.
 * @returns The base API URL or null if invalid.
 */
export function getApiUrlFromWikiUrl(wikiUrl: string): string | null {
  try {
    const url = new URL(wikiUrl);
    if (url.hostname.endsWith('.fandom.com')) {
      return `${url.protocol}//${url.hostname}/api.php`;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetches all page titles from a Fandom wiki, handling pagination.
 * @param apiUrl The base API URL of the wiki.
 * @returns A promise that resolves to an array of page titles.
 */
export async function getAllPageTitles(apiUrl: string): Promise<string[]> {
  let allTitles: string[] = [];
  let shouldContinue = true;
  let nextContinueToken: string | undefined = undefined;

  while (shouldContinue) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      list: 'allpages',
      aplimit: '500',
      origin: '*',
    });

    if (nextContinueToken) {
      params.set('apcontinue', nextContinueToken);
    }

    const response = await fetch(`${apiUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: AllPagesApiResponse = await response.json();
    const titles = data.query.allpages.map(page => page.title);
    allTitles = allTitles.concat(titles);

    if (data.continue) {
      nextContinueToken = data.continue.apcontinue;
    } else {
      shouldContinue = false;
    }
  }

  return allTitles;
}

/**
 * Fetches the parsed HTML content of a specific page.
 * @param apiUrl The base API URL of the wiki.
 * @param pageTitle The title of the page to fetch.
 * @returns A promise that resolves to the HTML content of the page.
 */
export async function getPageHtml(apiUrl: string, pageTitle: string): Promise<string> {
    const params = new URLSearchParams({
        action: 'parse',
        format: 'json',
        page: pageTitle,
        prop: 'text',
        origin: '*',
      });
    
      const response = await fetch(`${apiUrl}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch page "${pageTitle}": ${response.statusText}`);
      }
    
      const data: ParseApiResponse = await response.json();
      if (data.parse && data.parse.text && data.parse.text['*']) {
        return data.parse.text['*'];
      }
      
      // Handle cases where a page might be a redirect or doesn't exist.
      // The API returns a valid response but without the 'text' property.
      console.warn(`Could not retrieve content for page: "${pageTitle}". It might be a redirect or special page. Skipping.`);
      return `<!-- Content for page "${pageTitle}" could not be loaded. -->`;
}
