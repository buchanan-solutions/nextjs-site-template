import { Document as BaseDocument } from "@/lib/cms/types/document";
import { Media } from "@/lib/cms/types/media";

// export interface Document extends BaseDocument {
//   template?: string;
// }

export interface DocumentWithSlug extends BaseDocument {
  slug: string;
}

export interface DocumentWithSEO extends DocumentWithSlug {
  seo?: {
    title?: string;
    description?: string;
    image?: Media;
  };
}
