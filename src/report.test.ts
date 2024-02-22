import { describe, it, expect, spyOn } from 'bun:test';
import { printReport, sortPages } from './report';
import { logger } from './utils/logger';

describe('sortPages', () => {
  it('should sort pages by visit count in descending order', () => {
    const pages = {
      'example.com/page-1': 5,
      'example.com/page-2': 3,
      'example.com/page-3': 7,
    };

    const sortedPages = sortPages(pages);

    expect(sortedPages).toEqual([
      ['example.com/page-3', 7],
      ['example.com/page-1', 5],
      ['example.com/page-2', 3],
    ]);
  });
});

const loggerSpy = spyOn(logger, logger.success.name as keyof typeof logger);

describe('printReport', () => {
  it('should print a report of pages in descending order', () => {
    const pages = {
      'example.com/page-1': 5,
      'example.com/page-2': 3,
      'example.com/page-3': 7,
    };

    printReport(pages);

    expect(loggerSpy).toHaveBeenCalledTimes(6);
    expect(loggerSpy).toHaveBeenCalledWith('==========');
    expect(loggerSpy).toHaveBeenCalledWith('REPORT');
    expect(loggerSpy).toHaveBeenCalledWith('==========');
  });
});
