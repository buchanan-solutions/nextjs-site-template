import type { Document } from "@/cms/types/document";
import { Media } from "@/lib/cms/types/media";

/**
 * Home page fields from CMS (client-specific)
 */
export interface Home extends Document {
  Letter: string;
  letter_image: Media;
  offerings_description: string;
  offerings_1: {
    title: string;
    body: string;
  }
  offerings_2: {
    title: string;
    body: string;
  }
}
