import type { DocumentWithSlug } from "@/cms/types/document";
import type { Document } from "@/lib/cms/types/document";
import { Page } from "@/cms/types/page";
import { Global } from "@/cms/types/global";

export interface TemplatePageProps {
  locale: string;
  globalData: Global;
  page: Page;
  collectionItems?: DocumentWithSlug[];
  collectionItem?: DocumentWithSlug;
  singleItem?: Document;
}
