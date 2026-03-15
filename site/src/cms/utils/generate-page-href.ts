import { Page } from "@/cms/types/page";

export function generatePageHref(page: Page | undefined) {
    if (!page) return "";
    return "/" + (page.locale ? page.locale + "/" + page.slug : page.href || "");
}