# Next.js + Strapi Website Template

A reusable website template built with a headless CMS architecture.

The system combines:

* A **Next.js frontend** responsible for rendering pages, layouts, UI composition, localization routing, and client/server rendering concerns.
* A **Strapi CMS backend** that manages structured content, localization, media assets, and content modeling via content-types and single-types.

The template is designed to:

* Fetch structured content from Strapi at build time and runtime
* Support internationalization via locale-based routing
* Provide modular page templates driven by CMS-managed content
* Separate content structure from presentation logic
* Enable flexible layout composition (headers, footers, sections, navigation)
* Serve as a starting point for content-driven marketing or informational sites

## Core characteristics:

* Headless CMS integration
* Typed content contracts
* Locale-aware routing
* Pluggable page templates
* Reusable layout system
* Environment-configurable runtime behavior

## Project Folder Structure

cms/        # Strapi CMS project (content management and API)
docs/       # Documentation for setup and usage
nginx/      # Nginx configuration files for deployment
site/       # Next.js frontend application (website UI & routing)

The repository functions as a baseline implementation that can be extended with additional content types, UI components, and deployment configurations.
