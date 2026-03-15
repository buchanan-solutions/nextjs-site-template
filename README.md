# Strapi & NEXTJS Website Template

## Strapi v5 CMS & NEXTJS Website Setup process

1. Build Strapi V5
2. Generate API Token w permissions
3. Save API token to the ENV file and set the env vars:

   - NEXT_PUBLIC_STRAPI_URL
   - STRAPI_CMS_API_URL

   Note: Use host.docker.internal:PORT if building locally in docker to allow the UI build process to tap directly into the STRAPI container.

4. Build website
