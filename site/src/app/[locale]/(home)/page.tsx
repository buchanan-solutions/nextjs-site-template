// ./src/app/[locale]/(home)/page.tsx

import { getGlobal, getHome, getMenu } from "@/cms/services/singles";
import { loggerFactory } from "@/lib/logger/server/factory";
import HomePage from "@/templates/home-page";
import { createStrapiClient } from "@/lib/cms/server/strapi-client";

const log = loggerFactory.createLogger("homePage", { level: "debug" });

export default async function Page({ params }: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const client = createStrapiClient();
  const globalData = await getGlobal(client, locale, log);
  const homeData = await getHome(client, locale, log);
  const menuData = await getMenu(client, locale, log);

  log.info("locale in home page", locale);
  return (
    <HomePage
      locale={locale}
      globalData={globalData}
      homeData={homeData}
      menuData={menuData}
    />
  );
}
