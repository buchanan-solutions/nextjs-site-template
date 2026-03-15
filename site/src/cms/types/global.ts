import type { Document } from "@/lib/cms/types/document";
import type { Media } from "@/lib/cms/types/media";

export interface Global extends Document {
  siteName: string;
  siteDescription: string;
  linkedin_url: string;
  favicon: Media;
  logo: Media;
  tagline?: {
    main?: string;
    secondary?: string;
  };
  companyLegalName?: string;
}
