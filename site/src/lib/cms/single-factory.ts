// ./src/lib/cms/single-factory.ts

import { API, SingleTypeManager, StrapiClient } from "@strapi/client";
import { LoggerLike, NoopLogger } from "@buchanan-solutions/ts-logkit";
import type { Result } from "./types/result";
import { HTTPNotFoundError } from "@strapi/client";

/**
 * Configuration for fetchSingle
 *
 * @template TData - the type of the raw Strapi response (DTO)
 * @template TResult - the type of the app-facing object after optional transformation
 */
export interface SingleFactoryConfig<TData = unknown, TResult = TData> {
  /** The Strapi single-type resource name, e.g., "global" or "menu" */
  resource: string;

  /** Optional population or filtering options for the Strapi query */
  params?: API.BaseQueryParams;

  /** Optional locale for the query */
  locale?: string;

  /**
   * Optional transformation function to map the Strapi DTO (TData)
   * to the app-facing type (TResult). Use this when:
   *  - DTO structure differs from your app type
   *  - You need derived or computed fields
   *  - You want to flatten nested objects
   *  - You want to normalize or sanitize the data
   */
  transform?: (data: TData) => TResult;
}

/**
 * Generic Single Fetcher
 *
 * Fetches a Strapi single-type and returns either the raw data or a transformed object.
 *
 * Example use cases:
 *
 * 1️⃣ **Direct mapping:** Strapi response matches app-facing type exactly
 *
 * ```typescript
 *    const global = await fetchSingle<Global>({ resource: "global", locale: "en" });
 * ```
 *
 * 2️⃣ **Transformed mapping:** DTO needs computation or flattening
 *
 * ```typescript
 *    interface About { title: string; description: string; blocks: any[] }
 *    interface AboutDTO { title: string; subtitle: string; summary: string; blocks: any[] }
 *
 *    const about = await fetchSingle<AboutDTO, About>({
 *      resource: "about",
 *      transform: (dto) => ({
 *        title: dto.title,
 *        description: `${dto.title} - ${dto.subtitle}: ${dto.summary}`,
 *        blocks: dto.blocks || [],
 *      }),
 *    });
 * ```
 *
 * 3️⃣ **Optional population or filtering:** add params and locale as needed
 */
export async function fetchSingle<TData = unknown, TResult = TData>(
  client: StrapiClient,
  config: SingleFactoryConfig<TData, TResult>,
  logger: LoggerLike = NoopLogger,
): Promise<Result<TResult | null, string, unknown>> {
  const log = logger.child("fetchSingle");

  try {
    const { resource, params, locale, transform } = config;

    let response: API.DocumentResponse;
    try {
      response = await client.single(resource).find({
        ...params,
        locale,
      });

    } catch (error) {
      if (error instanceof HTTPNotFoundError ) {
        log.info(`Single not found: ${resource}`, error.message);
        return { success: true, data: null };
      }
      else if (error instanceof Error) {
        log.error(`Failed to fetch single: ${resource}`, error.message);
        return { success: false, error: error.message, data: error };
      } else {
        log.error(`Failed to fetch single: ${resource}`, String(error));
        return { success: false, error: String(error), data: error };
      }
    }

    const data = response.data;
    if (!data) {
      const message = `No data found for single: ${resource}`;
      log.warn(`⚠️ ${message}`);
      return { success: false, error: message };
    }

    // Use transform if provided, otherwise cast data to TResult
    const result = transform ? transform(data as TData) : (data as TResult);
    log.debug(`✅ Single fetched: ${resource}`, result);

    return { success: true, data: result };
  } catch (error) {
    const message = `Failed to fetch single: ${config.resource}`;
    log.error(`❌ ${message}`, error);
    return { success: false, error: message, data: error };
  }
}
