import { Media } from "@/lib/cms/types/media";
import type { API } from "@strapi/client";

export interface Document extends API.Document {
  id: number;
  publishedAt?: string;
  locale: string;
  
  // Custom fields for documents that need to be rendered as a specific template.
  template?: string;
}

export interface DocumentWithSlug extends Document {
  slug: string;
}

export interface DocumentWithSEO extends DocumentWithSlug {
  seo?: {
    title?: string;
    description?: string;
    image?: Media;
  };
}
