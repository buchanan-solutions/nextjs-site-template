// ./src/lib/cms/utils/get-locales.ts
import { StrapiClient } from "@strapi/client";
import { LoggerLike, NoopLogger } from "@buchanan-solutions/ts-logkit";
import type { Result } from "@/types/result";

export interface GetSupportedLocalesOptions {
  cachedLocales: string[] | null;
  lastFetched: number;
  CACHE_TTL: number;
}

/**
 * Fetches the supported locales from the Strapi CMS.
 *
 * This function is responsible only for fetching and optional caching of the
 * locales. It does not apply any default/fallback locale; callers are expected
 * to handle fallbacks (e.g. use a default when the returned array is empty).
 *
 * - Pure mode: Call without `options` to always fetch from Strapi.
 * - Cached mode: Provide `options` to use and update a cache.
 *
 * @param client - The Strapi client
 * @param options - Optional caching configuration { cachedLocales, lastFetched, CACHE_TTL }
 * @param logger - Optional logger instance
 * @returns Promise resolving to the list of supported locale codes (empty on failure)
 *
 * @example
 * // Pure, always fetch:
 * const locales = await getSupportedLocales(client);
 *
 * @example
 * // Cached:
 * const localeCache = { cachedLocales: null, lastFetched: 0, CACHE_TTL: 3600000 };
 * const locales = await getSupportedLocales(client, localeCache, logger);
 */
export async function getLocales(
  client: StrapiClient,
  options?: GetSupportedLocalesOptions,
  logger: LoggerLike = NoopLogger
): Promise<Result<string[]>> {
  const log = logger.child("getSupportedLocales");

  if (options) {
    const { cachedLocales, lastFetched, CACHE_TTL } = options;

    const now = Date.now();
    if (cachedLocales && now - lastFetched < CACHE_TTL) {
      log.info("Using cached locales");
      log.debug('Cached locales:', cachedLocales);
      return {
        success: true,
        data: cachedLocales,
      };
    }
  }

  try {
    log.info("Fetching locales from Strapi");
    const response = await fetch(
      `${process.env.STRAPI_CMS_API_URL}/api/i18n/locales`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_CMS_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      log.error(
        `Failed to fetch locales: ${response.status} ${response.statusText}`
      );
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    log.debug('Locales response data:', data);
    const locales = data.map((l: { code: string }) => l.code);

    if (options) {
      options.cachedLocales = locales;
      options.lastFetched = Date.now();
    }

    log.debug(
      `Fetched and cached ${locales.length} locales: ${locales.join(", ")}`
    );
    log.info(`Locales fetched successfully`);

    return {
      success: true,
      data: locales,
    };
  } catch (err) {
    log.error("Failed to fetch locales", err);

    return {
      success: false,
      error:
        err instanceof Error
          ? `Failed to fetch locales: ${err.message}`
          : "Failed to fetch locales: Unknown error",
    };
  }
}