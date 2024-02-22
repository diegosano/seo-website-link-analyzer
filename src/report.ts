import type { PagesCount } from './crawl';
import { logger } from './utils/logger';

/**
 * Print a report of pages in the terminal in a human-friendly way
 * @param pages The pages dictionary of page url -> total count of visits
 */
export function printReport(pages: PagesCount) {
  logger.success('==========');
  logger.success('REPORT');
  logger.success('==========');

  const sortedPages = sortPages(pages);

  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const count = sortedPage[1];
    logger.success(`Found ${count} internal links to: "${url}"`);
  }
}

/**
 * Sort the pages dictionary into array of tuples (url, count) with the highest counts first in the list
 * @param pages The pages dictionary of page url -> total count of visits
 * @returns A sorted array of tuples (url, count).
 */
export function sortPages(pages: PagesCount) {
  const pagesArray = Object.entries(pages);

  pagesArray.sort((pageA, pageB) => {
    return pageB[1] - pageA[1];
  });

  return pagesArray;
}
