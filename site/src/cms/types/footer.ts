import type { MenuItem } from "@/cms/components/menu/menu-item";
import type { Document } from "@/cms/types/document";

export interface Footer extends Document {
  legalLinks: MenuItem[];
  contact_us_cta: {
    title: string;
    body: string;
  }
}
