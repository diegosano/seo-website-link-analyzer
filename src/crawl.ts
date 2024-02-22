import { URL } from 'node:url';
import { JSDOM } from 'jsdom';

import { areURLsInSameDomain } from '@/utils/are-urls-in-same-domain';
import { logger } from '@/utils/logger';

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

export interface PagesCount {
  [key: string]: number;
}

export async function crawlPage(
  baseURL: string,
  currentURL: string,
  pages: PagesCount
) {
  const isSameDomain = areURLsInSameDomain(baseURL, currentURL);

  if (!isSameDomain) {
    logger.info(`Skipping ${currentURL}, is not in the same domain`);
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (Object.hasOwn(pages, normalizedCurrentURL)) {
    pages[normalizedCurrentURL]++;
    logger.info(
      `Already visited ${currentURL}, setting count to ${pages[normalizedCurrentURL]}`
    );
    return pages;
  }

  pages[normalizedCurrentURL] = baseURL === normalizedCurrentURL ? 0 : 1;

  logger.info(`Crawling ${currentURL} ...`);

  try {
    const response = await fetch(currentURL);

    if (!response.ok) {
      logger.error(
        `Error trying to fetch URL ${currentURL}, HTTP status code: ${response.status}: ${response.statusText}`
      );
      return pages;
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('text/html')) {
      logger.error(
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
      logger.error(error.message);
    } else {
      logger.error(error);
    }
    return pages;
  }
}
