// ./src/app/[locale]/[...slug]/page.tsx

import { notFound } from "next/navigation";
import { createCollectionFactory } from "@/lib/cms/collections/collection-factory";
import { getPageMap } from "@/cms/collections/pages/page-cache";
import { PageContextSetter } from "@/cms/page-context-setter";
import { fetchSingle } from "@/lib/cms/single-factory";
import { DocumentWithSlug } from "@/cms/types/document";
import type { Page } from "@/cms/types/page";
import { decodeSlugArray } from "@/cms/utils/decode-slug";
import { getGlobal } from "@/cms/services/singles/global";
import { getTemplateComponent } from "@/templates/_templates";
import { Global } from "@/cms/types/global";

import { loggerFactory } from "@/lib/logger/server/factory";
import { createStrapiClient } from "@/lib/cms/server/strapi-client";

const log = loggerFactory.createLogger("...slug", { level: "debug" });

/**
 * Gets all pages from Strapi and returns an array of objects with locale and slug
 *
 * Will be used to generate the static pages for each page. If the page.isCollection is true, then
 * the page will be a collection page. This will pass the page.collection (collection name) to the page context
 * where then the collectionTemplate will use that collection name to fetch the types collection items from the CMS.
 *
 * @returns params: Array of objects with locale and slug
 */
export async function generateStaticParams() {
  log.info("Generating static params for all pages");

  const pageMap = await getPageMap();
  const params = [];

  // ==================================================
  // Page
  // ==================================================

  for (const page of pageMap.values()) {
    // Normalize page.slug to remove leading/trailing slashes
    const baseSlug = page.slug.replace(/^\/|\/$/g, "");

    // Always push the main page itself to the params output
    params.push({
      locale: page.locale,
      slug: baseSlug ? baseSlug.split("/") : [],
    });

    // ==================================================
    // Page = Collection
    // ==================================================

    // Handle collection-type pages
    // Only generate static params for collection items if collectionItemTemplate is set
    if (
      page.isCollection &&
      page.collection &&
      page.collectionItemTemplate &&
      page.collectionItemTemplate.trim() !== ""
    ) {
      log.info(
        `Processing collection page ${page.locale}/${page.slug}: ${page.collection}`,
      );

      // const cacheKey = `${page.collection}:${page.locale}`;
      // let allItems = collectionCache.get(cacheKey);

      // if (!allItems) {
      // Create a new collection factory
      const collectionFactory = createCollectionFactory<DocumentWithSlug>({
        collectionName: page.collection,
        loggerName: `${page.collection}Factory`,
        logLevel: "debug",
      });

      // Get all published collection items for this locale
      const allItems = await collectionFactory.findAll({
        // fields: ["slug"],
        populate: "*",
        locale: page.locale,
        status: "published",
      });
      //   collectionCache.set(cacheKey, allItems);
      // }

      for (const item of allItems) {
        log.info("Pushing item: " + item.slug + " to render list...");
        const itemSlug = item.slug.replace(/^\/|\/$/g, ""); // just in case

        params.push({
          locale: page.locale,
          slug: [...(baseSlug ? baseSlug.split("/") : []), itemSlug],
        });

        // ==================================================
        // Collection = Surveys
        // ==================================================

        log.debug(
          `Pushed collection item: ${page.locale}/${baseSlug}/${itemSlug}`,
        );
      }
    }
  }

  log.info(`Generated static params for all pages (${params.length} total)`);
  log.debug("Params:", params);

  return params;
}

/**
 *
 * Generates the static metadata for the page.
 *
 * Important for SEO and social media sharing.
 *
 * @param params - The parameters from the URL
 * @returns The metadata for the page
 */
export async function generateMetadata({ params }: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const decodedSlug = decodeSlugArray(slug, (error) => {
    log.error("Error decoding slug:", { error });
  });

  const requestCollectionCache = new Map<string, DocumentWithSlug[]>();
  const result = await resolvePageFromSlug(
    locale,
    decodedSlug,
    requestCollectionCache,
  );

  if (!result) {
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const { page, item } = result;

  type CMSFields = {
    seoTitle?: string;
    metaTitle?: string;
    title?: string;
    name?: string;
    seoDescription?: string;
    description?: string;
    summary?: string;
    image?: { url: string };
  };

  const safeGet = <T extends CMSFields | null | undefined>(
    obj: T,
    keys: (keyof CMSFields)[],
  ): string | undefined => {
    if (!obj) return undefined;
    for (const key of keys) {
      const value = obj[key];
      if (typeof value === "string" && value.trim()) return value;
    }
    return undefined;
  };

  // ✅ Try multiple common CMS field names safely
  const title =
    safeGet(item as CMSFields, ["seoTitle", "metaTitle", "title", "name"]) ||
    safeGet(page as CMSFields, ["seoTitle", "metaTitle", "title"]) ||
    "Untitled Page";

  const description =
    safeGet(item as CMSFields, ["seoDescription", "description", "summary"]) ||
    safeGet(page as CMSFields, ["seoDescription", "description"]) ||
    undefined;

  const imageUrl =
    (item as CMSFields)?.image?.url ||
    (page as CMSFields)?.image?.url ||
    undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
    twitter: {
      title,
      description,
    },
  };
}

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string; slug: string[] }>;
// }) {
//   const { locale, slug } = await params;
//   const decodedSlug = decodeSlugArray(slug, (error) => {
//     log.error("Error decoding slug:", { error });
//   });
//   const requestCollectionCache = new Map<string, DocumentWithSlug[]>();

//   const result = await resolvePageFromSlug(
//     locale,
//     decodedSlug,
//     requestCollectionCache
//   );

//   if (!result) {
//     return {
//       title: "Page Not Found",
//       description: "The page you are looking for does not exist.",
//     };
//   }

//   const { page, item } = result;

//   // ✅ Prefer item metadata, fallback to page metadata
//   const title = item?.title || page.title;
//   const description = item?.description || page.description || undefined;

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       ...(item?.image && { images: [item.image.url] }),
//     },
//     twitter: {
//       title,
//       description,
//     },
//   };
// }

export default async function Page({ params}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params; // ✅ await params (required in Next 15.5+
  const client = await createStrapiClient();
  log.info("Rendering page at: /" + locale + "/" + slug.join("/"));

  const decodedSlug = decodeSlugArray(slug, (error) => {
    log.error("Error decoding slug:", { error });
  });

  log.info("Params:", { locale, decodedSlug });

  // Create a per-request collection cache
  const requestCollectionCache = new Map<string, DocumentWithSlug[]>();

  // Decode the slug & fetch the page
  // const page = await getPageBySlug(locale, decodedSlug);
  const result = await resolvePageFromSlug(
    locale,
    decodedSlug,
    requestCollectionCache,
  );
  if (!result) return notFound();

  const { page, item } = result;

  if (!page) {
    log.error("Page not found:", { slug: decodedSlug });
    return notFound();
  }

  if (item) {
    log.info("Item found:", { slug: decodedSlug, item: item.slug });
  }

  const globalData = await getGlobal(client, locale, log);

  if (!globalData) {
    log.error("Global data not found:", { locale });
    return notFound();
  }

  let collectionItems: DocumentWithSlug[] | undefined;
  if (page.isCollection && !item) {
    log.info(
      "Page is a collection and no item found, fetching collection items...",
    );
    const cacheKey = `${page.collection}:${locale}`;
    // collectionItems = collectionCache.get(cacheKey);
    collectionItems = requestCollectionCache.get(cacheKey);

    if (!collectionItems) {
      if (!page.collection)
        throw new Error("Page is a collection but has no collection name");
      const factory = createCollectionFactory<DocumentWithSlug>({
        collectionName: page.collection,
        loggerName: `${page.collection}Factory`,
      });
      collectionItems = await factory.findAll({
        populate: "*",
        locale: locale,
        status: "published",
      });
      if (page.collection === "articles") {
        console.log("Article Items Raw", collectionItems);
      }
      // collectionCache.set(cacheKey, collectionItems);
      requestCollectionCache.set(cacheKey, collectionItems);
    }
  }

  // Handle single item page
  let singleItem: Document | undefined | null;
  if (page.single_id) {
    log.info("Page is a single item page, fetching single item:", page.single_id);
    const singleItemResult = await fetchSingle<Document>(
      client, {
        resource: page.single_id,
        locale: locale,
        params: { populate: "*" },
      }, 
      log,
    );
    if (singleItemResult.success) {
      singleItem = singleItemResult.data;
    } else {
      log.error("Failed to fetch single item:", singleItemResult.error);
      return notFound();
    }
    log.info("Single item from factory:",  singleItem);
    // if (singleItemRes) {
    log.info("Single item found - setting singleItem");
    // singleItem = singleItem;
    log.info("Single item set:", singleItem);
    // return {
    //   page,
    //   item: singleItem,
    // };
    // }
  }

  return renderTemplate(locale, globalData, page, collectionItems, item, singleItem ?? undefined);
}

// Small helper outside of render
function renderTemplate(
  locale: string,
  globalData: Global,
  page: Page,
  collectionItems?: DocumentWithSlug[],
  collectionItem?: DocumentWithSlug,
  singleItem?: Document,
) {
  let resolvedTemplate: string = "default";

  if (page.isCollection) {
    if (collectionItem) {
      // Render single collection item
      if (collectionItem.template) {
        resolvedTemplate = collectionItem.template;
      } else {
        resolvedTemplate =
          page.collectionItemTemplate || page.template || "default";
      }
      // resolvedTemplate =
      //   page.collectionItemTemplate || page.template || "default";
    } else {
      // Render collection listing
      resolvedTemplate = page.template || "default";
    }
  } else {
    // Regular page
    resolvedTemplate = page.template || "default";
  }

  const Template = getTemplateComponent(resolvedTemplate);
  return (
    <>
      <PageContextSetter page={page} />
      <Template locale={locale} globalData={globalData} page={page} collectionItems={collectionItems} collectionItem={collectionItem} singleItem={singleItem} />
    </>
  );
}

async function resolvePageFromSlug(
  locale: string,
  slug: string[],
  requestCollectionCache: Map<string, DocumentWithSlug[]>,
): Promise<{ page: Page; item?: DocumentWithSlug } | null> {
  const pageMap = await getPageMap();

  // Try full slug first
  const fullSlug = slug.join("/");
  const page = pageMap.get(`${locale}:${fullSlug}`);

  if (page) {
    return { page };
  }

  // If no exact match, try to find a parent page for a collection
  for (let i = slug.length - 1; i > 0; i--) {
    const parentSlug = slug.slice(0, i).join("/");
    const childSlug = slug.slice(i).join("/");
    const potentialParent = pageMap.get(`${locale}:${parentSlug}`);

    if (potentialParent?.isCollection && potentialParent.collection) {
      const cacheKey = `${potentialParent.collection}:${locale}`;
      // let items = collectionCache.get(cacheKey);
      let collectionItems = requestCollectionCache.get(cacheKey);

      if (!collectionItems) {
        const collectionFactory = createCollectionFactory<DocumentWithSlug>({
          collectionName: potentialParent.collection,
          loggerName: `${potentialParent.collection}Factory`,
          logLevel: "debug",
        });
        collectionItems = await collectionFactory.findAll({
          populate: "*",
          locale: locale,
          status: "published",
        });
        // collectionCache.set(cacheKey, items);
        requestCollectionCache.set(cacheKey, collectionItems);
      }

      const item = collectionItems.find((i) => i.slug === childSlug);
      if (item) {
        return { page: potentialParent, item };
      }
    }
  }

  return null;
}
