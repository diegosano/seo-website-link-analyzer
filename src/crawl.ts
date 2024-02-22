import { URL } from 'node:url';
import { JSDOM } from 'jsdom';

/**
 * Normalize URL.
 * @param url The input URL to be normalized.
 * @returns A normalized URL.
 */
export function normalizeURL(url: string): string {
  const parsedURL = new URL(url);
  const normalizedPathname = parsedURL.pathname.replace(/\/+$/, '');
  return `${parsedURL.hostname}${normalizedPathname}`;
}

/**
 * Extracts URLs from an HTML string.
 * @param htmlBody The HTML content to parse.
 * @param baseURL The root URL of the website (used for relative URL conversion).
 * @returns An array of normalized URLs found within the HTML.
 */
export function getURLsFromHTML(htmlBody: string, baseURL: string): string[] {
  const dom = new JSDOM(htmlBody);
  const links = dom.window.document.querySelectorAll('a');

  const absoluteURLs: string[] = [];
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const absoluteURL = new URL(href, baseURL).href;
      absoluteURLs.push(absoluteURL);
    }
  });

  return absoluteURLs;
}
