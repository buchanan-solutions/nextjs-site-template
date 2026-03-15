/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from "react";

export interface TemplateMeta {
  name: string;
  description: string;
  component: ComponentType<any>;
  // isCollection?: boolean;
  type?: "collection" | "tool" | "page" | "policy" | "single";
  [key: string]: any;
}

export type TemplateRepository = Record<string, TemplateMeta>;

/**
 * Creates a template registry, registry metadata, and helper functions.
 * This can be reused across projects that define their own TEMPLATES map.
 */
export function createTemplateRegistry(templates: TemplateRepository) {
  const TEMPLATE_REGISTRY: Record<
    string,
    ComponentType<any>
  > = Object.fromEntries(
    Object.entries(templates).map(([key, meta]) => [key, meta.component]),
  );

  const TEMPLATE_REGISTRY_METADATA = Object.fromEntries(
    Object.entries(templates).map(([key, meta]) => [
      key,
      {
        name: meta.name,
        description: meta.description,
        isCollection: meta.isCollection || false,
      },
    ]),
  );

  const getTemplateComponent = (templateName?: string): ComponentType<any> => {
    return (
      TEMPLATE_REGISTRY[templateName || "default"] || TEMPLATE_REGISTRY.default
    );
  };

  return {
    TEMPLATES: templates,
    TEMPLATE_REGISTRY,
    TEMPLATE_REGISTRY_METADATA,
    getTemplateComponent,
  };
}
