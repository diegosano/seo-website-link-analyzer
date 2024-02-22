import { expect, describe, it } from 'bun:test';
import { normalizeURL, getURLsFromHTML } from './crawl';

describe('normalizeURL', () => {
  it('should return url without protocol', () => {
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
  });

  it('should return url without slash', () => {
    const input = 'https://blog.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
  });

  it('should return url with all lower letters', () => {
    const input = 'https://BLOG.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
  });
});

describe('getURLsFromHTML', () => {
  it('should extract absolute URLs from HTML', () => {
    const htmlBody = `
        <html>
            <body>
                <a href="https://example.com"><span>Go to Boot.dev</span></a>
            </body>
        </html>
    `;

    const baseURL = 'https://example.com';
    const extractedURLs = getURLsFromHTML(htmlBody, baseURL);
    const expected = ['https://example.com/'];

    expect(extractedURLs).toEqual(expected);
  });

  it('should extract relative URLs from HTML', () => {
    const htmlBody = `
        <html>
            <body>
                <a href="/relative-link">Relative Link</a>
            </body>
        </html>
    `;

    const baseURL = 'https://example.com';
    const extractedURLs = getURLsFromHTML(htmlBody, baseURL);
    const expected = ['https://example.com/relative-link'];

    expect(extractedURLs).toEqual(expected);
  });

  it('should handle missing href attributes', () => {
    const htmlBody = `
        <html>
            <body>
                <a><span>No href attribute</span></a>
            </body>
        </html>
    `;

    const baseURL = 'https://example.com';
    const extractedURLs = getURLsFromHTML(htmlBody, baseURL);

    expect(extractedURLs).toEqual([]);
  });
});
