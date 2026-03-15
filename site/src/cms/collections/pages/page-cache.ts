// ./src/lib/cms/collections/pages/page-cache.ts

import type { Page } from "../../types/page";
import { getAllPages } from ".";

let pageMap: Map<string, Page> | null = null;

const disableCache =
  process.env.NEXT_PUBLIC_DISABLE_PAGE_CACHE === "true" || true;

/**
 * Gets the page map from the cache. If the page map is not in the cache, it will be created.
 *
 * @returns A map of all pages with the key being the locale and slug
 */
export async function getPageMap(): Promise<Map<string, Page>> {
  if (pageMap && !disableCache) return pageMap;

  const pages = await getAllPages();
  pageMap = new Map();

  for (const page of pages) {
    pageMap.set(`${page.locale}:${page.slug}`, page);
  }

  return pageMap;
}

/**
 * Gets a cached page from the cache. If the page is not in the cache, it will return null.
 *
 * @param locale - The locale of the page
 * @param slug - The slug of the page
 * @returns The page or null if not found
 */
export function getCachedPage(locale: string, slug: string): Page | null {
  return pageMap?.get(`${locale}:${slug}`) ?? null;
}

/**
 * Clears the page cache.
 */
export function clearPageCache() {
  pageMap = null;
}
