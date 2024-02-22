/**
 * Checks if two URLs are in the same domain.
 * @param url1 First URL.
 * @param url2 Second URL.
 * @returns `true` if both URLs have the same domain, otherwise `false`.
 */
export function areURLsInSameDomain(url1: string, url2: string): boolean {
  try {
    const parsedUrl1 = new URL(url1);
    const parsedUrl2 = new URL(url2);
    return parsedUrl1.hostname === parsedUrl2.hostname;
  } catch (error) {
    return false;
  }
}
