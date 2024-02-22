import { URL } from 'node:url';
import { JSDOM } from 'jsdom';

import { areURLsInSameDomain } from './utils';

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

interface Pages {
  [key: string]: number;
}

export async function crawlPage(
  baseURL: string,
  currentURL: string,
  pages: Pages
) {
  const isSameDomain = areURLsInSameDomain(baseURL, currentURL);

  if (!isSameDomain) {
    console.log(`Skipping ${currentURL}, is not in the same domain`);
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (Object.hasOwn(pages, normalizedCurrentURL)) {
    pages[normalizedCurrentURL]++;
    console.log(
      `Already visited ${currentURL}, setting count to ${pages[normalizedCurrentURL]}`
    );
    return pages;
  }

  pages[normalizedCurrentURL] = baseURL === normalizedCurrentURL ? 0 : 1;

  console.log(`Crawling ${currentURL} ...`);

  try {
    const response = await fetch(currentURL);

    if (!response.ok) {
      console.error(
        `Error trying to fetch URL ${currentURL}, HTTP status code: ${response.status}: ${response.statusText}`
      );
      return pages;
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('text/html')) {
      console.error(
        `Content-Type of response is "${contentType}", expecting "text/html"`
      );
      return pages;
    }

    const body = await response.text();

    const links = getURLsFromHTML(body, baseURL);
    for (const link of links) {
      pages = await crawlPage(baseURL, link, pages);
    }

    return pages;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    return pages;
  }
}
