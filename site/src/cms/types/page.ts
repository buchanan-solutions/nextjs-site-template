import { ComponentUnion } from "../components/component-union";

import { DocumentWithSlug } from "./document";

export interface Page extends DocumentWithSlug {
  /**
   * The title of the page.
   */
  title: string;

  /**
   * The template to use for this page. If the page is a collection page,
   * the template will be the collection (aka listing) template.
   *
   * if undefined, the default template will be used.
   */
  template?: string;

  /**
   * Whether the page is coming soon.
   */
  comingSoon: boolean;

  /**
   * Whether the page is a single item page.
   */
  isSingle: boolean;

  /**
   * The name of the single item to use for this page.
   */
  single_id?: string;

  /**
   * Whether the page is a collection page.
   */
  isCollection: boolean;

  /**
   * The name of the collection to use for this page.
   *
   * @example "employees", "projects", "services", etc.
   */
  collection?: string;

  /**
   * The "single item" template to use for any item in the collection.
   *
   * @example "team-member", "project", "service", etc.
   */
  collectionItemTemplate?: string;

  content?: ComponentUnion[];

  /**
   * Localized versons of the page. If currently viewing the Document.locale = "en" then
   * here will see the Document.locale = "fr" version of the page (as a child of itself).
   */
  localizations?: Page[];
}
