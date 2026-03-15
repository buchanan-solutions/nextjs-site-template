// src/components/templates/templates.tsx

// import dynamic from "next/dynamic";
import { createTemplateRegistry, type TemplateRepository } from "@/lib/cms/templates/templates-engine";

// import { ContactPage } from "@/cms/templates/contact";
// import { ToolboxTemplate } from "@/cms/templates/toolbox";
// import { DigitalMaturityAssessment } from "@/cms/tools/digital-maturity-assessment/digital-maturity-assessment-template";

import About from "./about"
import Articles from "./articles"
import Article from "./article"

// Define all templates with metadata
const TEMPLATES: TemplateRepository = {
  // =================================================================
  // Default Templates
  // =================================================================
  // default: {
  //   name: "Default",
  //   description: "Default template",
  //   // component: dynamic(() => import("./default")),
  //   component: DefaultTemplate,
  //   type: "page",
  // },

  // =================================================================
  // Page Templates
  // =================================================================
  about: {
    name: "About",
    description: "About page template",
    // component: dynamic(() => import("./about")),
    component: About,
    type: "page",
  },

  // ================================================================
  // Archive Templates
  // ================================================================
  "articles": {
    name: "Articles",
    description: "Articles Archive Template",
    component: Articles,
    type: "collection",
  },
  // "services-archive": {
  //   name: "Services Archive",
  //   description: "Services archive page template",
  //   component: ServicesArchive,
  //   type: "collection",
  // },

  // =================================================================
  // Single templates
  // =================================================================
  article: {
    name: "Article",
    description: "Collection template for individual articles",
    // component: dynamic(() => import("./collection/article")),
    component: Article,
    type: "single",
  },
  // "team-member": {
  //   name: "Team Member",
  //   description: "Collection template for team members",
  //   // component: dynamic(() => import("./collection/team-member")),
  //   component: TeamMemberTemplate,
  //   type: "collection",
  // },
  // service: {
  //   name: "Service",
  //   description: "Collection template for individual services",
  //   // component: dynamic(() => import("./collection/service")),
  //   component: ServiceSingle,
  //   type: "collection",
  // },
  // event: {
  //   name: "Event",
  //   description: "Collection template for individual events",
  //   // component: dynamic(() => import("./collection/event")),
  //   component: EventSingle,
  //   type: "collection",
  // },

  // =================================================================
  // Legal Templates
  // =================================================================
  // "privacy-policy": {
  //   name: "Privacy Policy",
  //   description: "Privacy policy page template",
  //   // component: dynamic(() => import("./privacy-policy")),
  //   component: PrivacyPolicyTemplate,
  //   type: "policy",
  // },
  // "terms-of-service": {
  //   name: "Terms of Service",
  //   description: "Terms of service page template",
  //   // component: dynamic(() => import("./terms-of-service")),
  //   component: TermsOfServiceTemplate,
  //   type: "policy",
  // },

  // =================================================================
  // Toolbox Templates
  // =================================================================
  // "digital-maturity-assessment": {
  //   name: "Digital Maturity Assessment",
  //   description: "Toolbox template for digital maturity assessment",
  //   component: DigitalMaturityAssessment,
  //   type: "tool",
  // },
};

// Use the shared template factory to generate helpers
export const {
  TEMPLATE_REGISTRY,
  TEMPLATE_REGISTRY_METADATA,
  getTemplateComponent,
} = createTemplateRegistry(TEMPLATES);

// Extract a map of just the components for runtime rendering
// export const TEMPLATE_REGISTRY: Record<
//   string,
//   ComponentType<any>
// > = Object.fromEntries(
//   Object.entries(TEMPLATES).map(([key, meta]) => [key, meta.component])
// );

// // Helper to get component by name
// export function getTemplateComponent(
//   templateName?: string
// ): ComponentType<any> {
//   return (
//     TEMPLATE_REGISTRY[templateName || "default"] || TEMPLATE_REGISTRY.default
//   );
// }

// // Export metadata for API consumption
// export const TEMPLATE_REGISTRY_METADATA = Object.fromEntries(
//   Object.entries(TEMPLATES).map(([key, meta]) => [
//     key,
//     {
//       name: meta.name,
//       description: meta.description,
//       isCollection: meta.isCollection || false,
//     },
//   ])
// );
