import type { TemplatePageProps } from "../../../cms/types/template-page-props";

export interface CollectionTemplatePageProps extends TemplatePageProps {
  collection: unknown[];
}
