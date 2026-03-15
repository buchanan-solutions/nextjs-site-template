// ./src/cms/services/singles/global.ts

import { StrapiClient } from "@strapi/client";
import { fetchSingle } from "@/lib/cms/single-factory";
import { LoggerLike, NoopLogger } from "@buchanan-solutions/ts-logkit";

import type { Global } from "@/cms/types/global";

export async function getGlobal(
  client: StrapiClient,
  locale: string,
  logger: LoggerLike = NoopLogger,
): Promise<Global | null> {
  const log = logger.child("getGlobal");
  log.info("Getting home page for locale: ", locale);
  const result = await fetchSingle<Global>(
    client,
    {
      resource: "global",
      locale: locale,
      params: { populate: "*" },
    },
    log,
  );

  if (!result.success) {
    log.info("Failed to fetch home page: ", result.error);
    log.debug("fetchSingle error data: ", result.data);
    // throw new Error(result.error);
    return null;
  }

  log.info("Home page fetched successfully: ", result.data);
  return result.data;
}
