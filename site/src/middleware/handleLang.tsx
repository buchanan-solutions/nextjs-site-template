// src/middleware/handleLang.ts
import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { loggerFactory } from "@/lib/logger/server/factory";
import { strapi, StrapiClient } from "@strapi/client";
import { getLocales, GetSupportedLocalesOptions } from "@/lib/cms/utils/get-locales";
import { LoggerLike, NoopLogger } from "@buchanan-solutions/ts-logkit";

export const DEFAULT_LOCALE = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const localeCache: GetSupportedLocalesOptions = {
  cachedLocales: null,
  lastFetched: 0,
  CACHE_TTL,
};

function getLocaleFromHeader(req: NextRequest, locales: string[], logger: LoggerLike = NoopLogger) {
  const log = logger.child("getLocaleFromHeader", { level: "debug" });
  log.info(`Getting locale from header`);
  const headers = {
    "accept-language": req.headers.get("accept-language") || "",
  };
  const languages = new Negotiator({ headers }).languages();
  const locale = match(languages, locales, DEFAULT_LOCALE);
  log.info(`Locale from header: ${locale}`);
  return locale;
}

/**
 * Middleware handler for locale detection and redirect.
 */
export async function handleLang(
  req: NextRequest,
  logger: LoggerLike = NoopLogger
): Promise<NextResponse | null> {
  const log = logger.child("handleLang", { level: "debug" });

  // Initialize the client
  const client = strapi({
    baseURL: process.env.STRAPI_CMS_API_URL || "http://cms:1337",
    auth: process.env.STRAPI_CMS_API_TOKEN,
  });
  
  const url = req.nextUrl.clone();

  log.info(`Handling language middleware for: ${url.pathname}`);
  log.debug(`Request headers: ${JSON.stringify(req.headers)}`);
  log.debug(`Request body: ${JSON.stringify(req.body)}`);
  log.debug(`Request: ${JSON.stringify(req)}`);

  // Skip static assets, API routes, favicon, and other files
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/favicon.ico") ||
    url.pathname.includes(".")
  ) {
    log.info("Skipping static assets, API routes, favicon, and file paths");
    return null;
  }

  // Fetch supported locales dynamically
  const localesResult = await getLocales(client, localeCache, log);

  let SUPPORTED_LOCALES: string[] = [DEFAULT_LOCALE];

  if (!localesResult.success) {
    log.error(
      `Failed to load locales from CMS, falling back to default locale "${DEFAULT_LOCALE}": ${localesResult.error}`
    );
  } else if (localesResult.data.length === 0) {
    log.warn?.(
      `CMS returned no locales, falling back to default locale "${DEFAULT_LOCALE}"`
    );
  } else {
    SUPPORTED_LOCALES = localesResult.data;
  }

  // Check if path already has a supported locale
  const pathLocale = SUPPORTED_LOCALES.find((l) =>
    url.pathname.startsWith(`/${l}`)
  );
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;

  log.debug(`Path locale: ${pathLocale}, Cookie locale: ${cookieLocale}`);

  const targetLocale =
    pathLocale || cookieLocale || getLocaleFromHeader(req, SUPPORTED_LOCALES);

  log.info(`Target locale determined: ${targetLocale}`);

  // Only redirect if path does not have a locale
  if (!pathLocale) {
    log.info(
      `No locale in path, redirecting to /${targetLocale}${url.pathname}`
    );
    url.pathname = `/${targetLocale}${url.pathname}`;
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, targetLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false, // allow client-side read
    });
    log.info(`Set cookie for locale: ${targetLocale}`);
    return res;
  }

  // Path already contains locale, ensure cookie is in sync
  if (cookieLocale !== pathLocale) {
    log.info(
      `Path has locale ${pathLocale} but cookie has ${cookieLocale}, syncing cookie`
    );
    const res = NextResponse.next();
    res.cookies.set(LOCALE_COOKIE, pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
    });
    log.info(`Synced cookie to match path locale: ${pathLocale}`);
    log.info(`Language middleware cookie sync completed`);
    return res;
  }

  log.info(`Path already localized correctly: ${url.pathname}`);
  log.info(`Language middleware completed - no action needed`);
  return null; // proceed to next middleware
}
