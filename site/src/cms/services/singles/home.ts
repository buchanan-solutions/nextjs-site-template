// ./src/cms/services/singles/home.ts

import { fetchSingle } from "@/lib/cms/single-factory";
import { LoggerLike, NoopLogger } from "@buchanan-solutions/ts-logkit";
import { StrapiClient } from "@strapi/client";

import type { Home } from "@/cms/types/home";

export async function getHome(
  client: StrapiClient,
  locale: string,
  logger: LoggerLike = NoopLogger,
): Promise<Home | null> {
  const log = logger.child("getHome");
  log.info("Getting home page for locale: ", locale);
  const result = await fetchSingle<Home>(
    client,
    {
      resource: "home",
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
