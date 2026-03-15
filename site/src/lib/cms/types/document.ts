// ./site/src/lib/cms/types/document.ts

import type { API } from "@strapi/client";

export interface Document extends API.Document {
  id: number;
  publishedAt?: string;
  locale: string;
}
