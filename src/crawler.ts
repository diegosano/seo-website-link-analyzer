import { URL } from 'node:url';

export function normalizeURL(inputURL: string): string {
  const parsedURL = new URL(inputURL);
  const normalizedPathname = parsedURL.pathname.replace(/\/+$/, '');
  return `${parsedURL.hostname}${normalizedPathname}`;
}
