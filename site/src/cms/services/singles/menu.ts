// ./src/cms/services/singles/menu.ts

import { fetchSingle } from "@/lib/cms/single-factory";
import { LoggerLike, NoopLogger } from "@buchanan-solutions/ts-logkit";
import { StrapiClient } from "@strapi/client";

import type { Menu } from "@/cms/types/menu";

export async function getMenu(
  client: StrapiClient,
  locale: string,
  logger: LoggerLike = NoopLogger,
): Promise<Menu | null> {
  const log = logger.child("getMenu");
  log.info("Getting menu for locale: ", locale);
  const result = await fetchSingle<Menu>(
    client,
    {
      resource: "menu",
      locale: locale,
      params: {
        populate: [
          "items",
          "items.page",
          "items.submenu_items",
          "items.submenu_items.page",
          "buttons.page",
        ],
      },
    },
    log,
  );

  if (!result.success) {
    log.info("Failed to fetch menu: ", result.error);
    log.debug("fetchSingle error data: ", result.data);
    // throw new Error(result.error);
    return null;
  }

  log.info("Menu fetched successfully: ", result.data);
  return result.data;
}