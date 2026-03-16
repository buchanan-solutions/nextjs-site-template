# Next.js + Strapi Website-in-a-Box

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

## Current limitations & assumptions

This template **assumes that all content is fetched from Strapi on the server (SSR/SSG)**. The public, read-only Strapi API key is **never exposed to the browser**; it is only used on the server side to hydrate pages. As a result, the current UI **does not perform client-side requests directly to Strapi**.

This choice was made primarily for:

* **Performance**: server-rendered pages can be cached and streamed efficiently.
* **Security**: the read-only API key is kept on the server, avoiding accidental exposure to the internet.

Teams that need **client-side, dynamic content fetching** can adapt this architecture by:

* Creating a dedicated client-side Strapi API client that is initialized with appropriately scoped credentials.
  * OR You could grant permissions to the "Public" user role in Strapi Admin to allow any unauthenticated user the ability to read certain content types.
* Adjusting the existing Strapi fetch utilities so they can be used from the browser where safe (or via additional backend endpoints where not).

In other words, client-side Strapi access is **possible but not enabled by default**; this repository favors server-rendered content and server-held secrets as a safe baseline.

## Project Folder Structure

cms/        # Strapi CMS project (content management and API)
docs/       # Documentation for setup and usage
nginx/      # Nginx configuration files for deployment
site/       # Next.js frontend application (website UI & routing)

The repository functions as a baseline implementation that can be extended with additional content types, UI components, and deployment configurations.
