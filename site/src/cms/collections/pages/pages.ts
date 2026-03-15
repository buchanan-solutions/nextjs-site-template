// ./src/lib/content/collections/pages.ts
import "server-only";

import { strapi } from "@strapi/client";
import type { Page } from "../../types/page";
import { loggerFactory } from "@/lib/logger/server/factory";

const log = loggerFactory.createLogger("cms.pages", { level: "info" });

const COLLECTION_NAME = "pages";

function getPagesManager() {
  try {
    log.info("(getPagesManager) Creating Client");
    const client = strapi({
      baseURL: process.env.STRAPI_CMS_API_URL + "/api" || "",
      auth: process.env.STRAPI_CMS_API_TOKEN || "",
    }).collection(COLLECTION_NAME);
    log.info("(getPagesManager) Client created successfully");
    return client;
  } catch (error) {
    log.error("(getPagesManager) Failed to create pages manager:", error);
    throw error;
  }
}

/**
 * Gets all pages from the CMS (for all locales).
 *
 * @returns An array of pages
 */
export async function getAllPages(): Promise<Page[]> {
  try {
    const mgr = getPagesManager();
    const pagesResponse = await mgr.find({
      populate: "*",
      locale: "*",
    });
    log.info("(getPages) Pages fetched successfully");
    log.debug("(getPages) Pages fetched successfully", pagesResponse);
    return (pagesResponse.data as Page[]) || [];
  } catch (error) {
    log.error("(getPages) Failed to fetch pages:", error);
    throw error;
  }
}

export async function getPageBySlug(
  locale: string,
  slug: string
): Promise<Page | null> {
  try {
    const mgr = getPagesManager();

    // Find page by slug
    const pageResponse = await mgr.find({
      filters: { slug: { $eq: slug } },
      populate: "*",
      locale: locale,
    });

    log.debug("(getPageBySlug) Page fetched successfully", {
      pageResponse,
    });

    const pageData = pageResponse.data?.[0] as Page;

    if (!pageData) {
      log.warn("(getPageBySlug) Page not found", { slug });
      return null;
    }

    // Transform the data to match our Feature interface
    // const page: Page = {
    //   // Document fields
    //   id: pageData.id,
    //   documentId: pageData.documentId,
    //   publishedAt: pageData.publishedAt,
    //   createdAt: pageData.createdAt,
    //   updatedAt: pageData.updatedAt,
    //   locale: pageData.locale,
    //   // Page fields
    //   slug: pageData.slug || "",
    //   title: pageData.title || "",
    //   template: pageData.template || "",
    //   comingSoon: pageData.comingSoon || false,
    // };

    return pageData;
  } catch (error) {
    log.error("(getPageBySlug) Failed to fetch page:", error);
    return null;
  }
}

/**
 * Get page by documentId and locale (for finding translated versions)
 */
export async function getPageByDocumentId(
  documentId: string,
  locale: string
): Promise<Page | null> {
  try {
    const mgr = getPagesManager();

    const pageResponse = await mgr.find({
      filters: { documentId: { $eq: documentId } },
      populate: "*",
      locale: locale,
    });

    log.debug("(getPageByDocumentId) Page fetched successfully", {
      pageResponse,
    });

    const pageData = pageResponse.data?.[0] as Page;

    log.debug("(getPageByDocumentId) Page data:", pageData);

    console.log("(getPageByDocumentId) Page data:", pageData);

    if (!pageData) {
      log.warn("(getPageByDocumentId) Page not found", { documentId, locale });
      return null;
    }

    // Transform the data to match our Page interface
    // const page: Page = {
    //   // Document fields
    //   id: pageData.id,
    //   documentId: pageData.documentId,
    //   publishedAt: pageData.publishedAt,
    //   createdAt: pageData.createdAt,
    //   updatedAt: pageData.updatedAt,
    //   locale: pageData.locale,
    //   // Page fields
    //   slug: pageData.slug || "",
    //   title: pageData.title || "",
    //   template: pageData.template || "",
    //   comingSoon: pageData.comingSoon || false,
    // };

    return pageData;
  } catch (error) {
    log.error("(getPageByDocumentId) Failed to fetch page:", error);
    return null;
  }
}

/**
 * Get all page slugs for static generation
 */
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const mgr = getPagesManager();
    const pagesResponse = await mgr.find({
      fields: ["slug"],
    });

    log.debug("Page slugs fetched successfully", { pagesResponse });

    return (
      (pagesResponse.data as Page[])
        ?.map((page) => page.slug)
        .filter(Boolean) || []
    );
  } catch (error) {
    log.error("Failed to fetch page slugs:", error);
    return [];
  }
}
