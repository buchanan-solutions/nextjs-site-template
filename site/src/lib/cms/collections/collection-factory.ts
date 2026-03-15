// ./src/lib/cms/collections/collection-factory.ts

import { strapi } from "@strapi/client";
import { Document } from "../types/document";
import { Loggable } from "@buchanan-solutions/ts-logkit";
import { loggerFactory } from "@/lib/logger/server/factory";

export interface CollectionFactoryConfig {
  collectionName: string;
  loggerName: string;
  logLevel?: "debug" | "info" | "warn" | "error" | "fatal";
}

export interface FindOptions {
  filters?: Record<string, unknown>;
  populate?: string | string[] | Record<string, unknown>;
  sort?: string | string[];
  fields?: string[];
  locale?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  status?: "draft" | "published";
}

export interface CollectionResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export class CollectionFactory<T extends Document> extends Loggable {
  private collectionName: string;

  constructor(config: CollectionFactoryConfig) {
    const logger = loggerFactory.createLogger(config.loggerName, { level: config.logLevel || "warn" });
    super(logger);
    this.collectionName = config.collectionName;
  }

  /**
   * Creates and returns a Strapi collection manager
   */
  private getManager() {
    try {
      this.log.info(
        `(getManager) Creating Client for ${this.collectionName}`
      );
      const client = strapi({
        baseURL: process.env.STRAPI_CMS_API_URL + "/api" || "",
        auth: process.env.STRAPI_CMS_API_TOKEN || "",
      }).collection(this.collectionName);
      this.log.info(
        `(getManager) Client created successfully for ${this.collectionName}`
      );
      return client;
    } catch (error) {
      this.log.error(
        `(getManager) Failed to create ${this.collectionName} manager:`,
        error
      );
      throw error;
    }
  }

  /**
   * Find all items in the collection
   */
  async findAll(options: FindOptions = {}): Promise<T[]> {
    try {
      const mgr = this.getManager();

      this.log.debug(
        `(findAll) Fetching ${this.collectionName} with options:`,
        options
      );

      const response = await mgr.find(options);
      this.log.info(
        `(findAll) ${this.collectionName} fetched successfully`
      );
      this.log.debug(
        `(findAll) ${this.collectionName} fetched successfully`,
        response
      );
      return (response.data as T[]) || [];
    } catch (error) {
      this.log.error(
        `(findAll) Failed to fetch ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Find a single item by slug
   */
  async findBySlug(
    slug: string,
    options: Omit<FindOptions, "filters"> = {}
  ): Promise<T | null> {
    try {
      const mgr = this.getManager();

      const findOptions: FindOptions = {
        ...options,
        filters: { slug: { $eq: slug } },
      };

      const response = await mgr.find(findOptions);

      this.log.debug(
        `(findBySlug) ${this.collectionName} fetched successfully`,
        { response }
      );

      const itemData = response.data?.[0] as T;

      if (!itemData) {
        this.log.warn(`(findBySlug) ${this.collectionName} not found`, {
          slug,
        });
        return null;
      }

      return itemData;
    } catch (error) {
      this.log.error(
        `(findBySlug) Failed to fetch ${this.collectionName}:`,
        error
      );
      return null;
    }
  }

  /**
   * Find a single item by any field
   */
  async findBy(
    field: string,
    value: unknown,
    options: Omit<FindOptions, "filters"> = {}
  ): Promise<T | null> {
    try {
      const mgr = this.getManager();

      const findOptions: FindOptions = {
        ...options,
        filters: { [field]: { $eq: value } },
      };

      const response = await mgr.find(findOptions);

      this.log.debug(
        `(findBy) ${this.collectionName} fetched successfully`,
        { response }
      );

      const itemData = response.data?.[0] as T;

      if (!itemData) {
        this.log.warn(`(findBy) ${this.collectionName} not found`, {
          field,
          value,
        });
        return null;
      }

      return itemData;
    } catch (error) {
      this.log.error(
        `(findBy) Failed to fetch ${this.collectionName}:`,
        error
      );
      return null;
    }
  }

  /**
   * Get all slugs for static generation
   */
  async getAllSlugs(): Promise<string[]> {
    try {
      const mgr = this.getManager();
      const response = await mgr.find({
        fields: ["slug"],
      });

      this.log.debug(`${this.collectionName} slugs fetched successfully`, {
        response,
      });

      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response.data as T[])?.map((item: any) => item.slug).filter(Boolean) ||
        []
      );
    } catch (error) {
      this.log.error(`Failed to fetch ${this.collectionName} slugs:`, error);
      return [];
    }
  }

  /**
   * Get items with custom filters
   */
  async findWhere(
    filters: Record<string, unknown>,
    options: Omit<FindOptions, "filters"> = {}
  ): Promise<T[]> {
    try {
      const mgr = this.getManager();

      const findOptions: FindOptions = {
        ...options,
        filters,
      };

      const response = await mgr.find(findOptions);

      this.log.debug(
        `(findWhere) ${this.collectionName} fetched successfully`,
        { response }
      );

      return (response.data as T[]) || [];
    } catch (error) {
      this.log.error(
        `(findWhere) Failed to fetch ${this.collectionName}:`,
        error
      );
      return [];
    }
  }

  /**
   * Count items in collection
   */
  async count(filters?: Record<string, unknown>): Promise<number> {
    try {
      const mgr = this.getManager();
      const response = await mgr.find({
        filters,
        pagination: { pageSize: 1 },
      });

      this.log.debug(
        `(count) ${this.collectionName} count fetched successfully`,
        { response }
      );

      return response.meta?.pagination?.total || 0;
    } catch (error) {
      this.log.error(
        `(count) Failed to count ${this.collectionName}:`,
        error
      );
      return 0;
    }
  }

  /**
   * Check if an item exists by slug
   */
  async existsBySlug(slug: string): Promise<boolean> {
    try {
      const item = await this.findBySlug(slug, { fields: ["slug"] });
      return item !== null;
    } catch (error) {
      this.log.error(
        `(existsBySlug) Failed to check existence in ${this.collectionName}:`,
        error
      );
      return false;
    }
  }

  /**
   * Get paginated results
   */
  async findPaginated(
    page: number = 1,
    pageSize: number = 25,
    options: FindOptions = {}
  ): Promise<CollectionResponse<T>> {
    try {
      const mgr = this.getManager();

      const findOptions: FindOptions = {
        ...options,
        pagination: { page, pageSize },
      };

      const response = await mgr.find(findOptions);

      this.log.debug(
        `(findPaginated) ${this.collectionName} fetched successfully`,
        { response }
      );

      return {
        data: (response.data as T[]) || [],
        meta: response.meta,
      };
    } catch (error) {
      this.log.error(
        `(findPaginated) Failed to fetch paginated ${this.collectionName}:`,
        error
      );
      return { data: [] };
    }
  }
}

/**
 * Helper function to create a collection factory instance
 */
export function createCollectionFactory<T extends Document>(
  config: CollectionFactoryConfig
): CollectionFactory<T> {
  return new CollectionFactory<T>(config);
}
