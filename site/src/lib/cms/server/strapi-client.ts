import { strapi, StrapiClient } from "@strapi/client";
import { LoggerLike, NoopLogger } from "@buchanan-solutions/ts-logkit";

export function createStrapiClient(
  logger: LoggerLike = NoopLogger,
): StrapiClient {
  const log = logger.child("createStrapiClient", { level: "debug" });

  let baseUrl = process.env.STRAPI_CMS_API_URL;
  if (!baseUrl) {
    baseUrl = "http://cms:1337";
    log.warn("STRAPI_CMS_API_URL is not set, using default: ", baseUrl);
  }

  let auth = process.env.STRAPI_CMS_API_TOKEN;
  if (!auth) {
    const error = new Error("STRAPI_CMS_API_TOKEN is not set");
    log.error("Error creating Strapi client: ", error.message);
    throw error;
  }

  const client = strapi({
    baseURL: baseUrl,
    auth: auth,
  });
  return client;
}
