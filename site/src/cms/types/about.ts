import type { Document } from "@/lib/cms/types/document";
import { Media } from "@/lib/cms/types/media";

/**
 * Home page fields from CMS (client-specific)
 */
export interface About extends Document {
  title: string;
  blocks: any[];
}
