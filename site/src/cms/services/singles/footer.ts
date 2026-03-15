// ./src/cms/services/singles/home.ts

import { fetchSingle } from "@/lib/cms/single-factory";
import { LoggerLike, NoopLogger } from "@buchanan-solutions/ts-logkit";
import { StrapiClient } from "@strapi/client";

import { Footer } from "@/cms/types/footer";

export async function getFooter(
  client: StrapiClient,
  locale: string,
  logger: LoggerLike = NoopLogger,
): Promise<Footer | null> {
  const log = logger.child("getFooter");
  log.info("Getting footer for locale: ", locale);
  const result = await fetchSingle<Footer>(
    client,
    {
      resource: "footer",
      locale: locale,
      params: { populate: "*" },
    },
    log,
  );

  if (!result.success) {
    log.info("Failed to fetch footer: ", result.error);
    log.debug("fetchSingle error data: ", result.data);
    // throw new Error(result.error);
    return null;
  }

  log.info("Footer fetched successfully: ", result.data);
  return result.data;
}
