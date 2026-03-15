// ./src/app/[locale]/layout.tsx

import { ReactNode } from "react";
import { LocaleProvider } from "@/providers/locale-provider";
import { loggerFactory } from "@/lib/logger/server/factory";
import { loadDictionary } from "@/lib/cms/utils/load-dictionary";
import DebuggableDiv from "@/components/debuggable/Div";
import { getLocales } from "@/lib/cms/utils/get-locales";
import { createStrapiClient } from "@/lib/cms/server/strapi-client";
import { getGlobal, getMenu } from "@/cms/services/singles";
import Header from "@/templates/header";
import Footer from "@/templates/footer";
import { PageContextProvider } from "@/cms/page-context";
import { getUiRuntimeConfig } from "@/lib/ui/utils/getUiRuntimeConfig";
import AdminFloater from "@/cms/admin-floater";

const log = loggerFactory.createLogger("localeLayout", { level: "debug" });

// Generate static params for supported locales
export async function generateStaticParams() {
  const client = createStrapiClient();
  const localesResult = await getLocales(client, undefined, log);
  if (!localesResult.success) {
    throw new Error(localesResult.error);
  }
  const locales = localesResult.data;
  return locales.map((locale: string) => ({ locale }));
}

const debug = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Language resolution is handled by the root layout and LanguageProvider
  const { locale } = await params;
  const uiRuntimeConfig = await getUiRuntimeConfig();

  log.info("Rendering LangLayout for locale: ", locale);

  const client = createStrapiClient();
  const globalData = await getGlobal(client, locale, log);
  const menuData = await getMenu(client, locale, log);
  // const footerData = await getFooter(locale);

  // const environment =
  //   (process.env.NEXT_PUBLIC_NODE_ENV as
  //     | "development"
  //     | "production"
  //     | "test") || "development";

  // log.info(`LangLayout: ${locale}, environment: ${environment}`);
  // log.debug("globalData: ", globalData);
  // log.debug(
  //   `Found ${menuItems?.items?.length} menu items`,
  //   menuItems?.items?.map((item) => item.label),
  // );

  // =====================================================
  // GET LANGUAGE AND DICTIONARY
  // =====================================================
  const dictionaryResult = await loadDictionary(locale);
  if (!dictionaryResult.success) {
    throw new Error(dictionaryResult.error);
  }
  const dictionary = dictionaryResult.data;

  const forceHeaderAndFooterDark = false;

  const isHomePage = !("slug" in params); // root /en or /fr

  let className = "flex flex-col"
  className += " min-h-screen"
  className += " overflow-y-auto";
  className += " max-h-screen";

  return (
    <LocaleProvider initialLocale={locale} dictionary={dictionary}>
      <PageContextProvider>
        <DebuggableDiv
          debug={debug}
          id="locale-layout"
          className={className}
        >
          <Header globalData={globalData} menuData={menuData} />
            {children}
          <Footer globalData={globalData} menuData={menuData} />
          {uiRuntimeConfig.nodeEnv === "development" && <AdminFloater />}
        </DebuggableDiv>
      </PageContextProvider>
    </LocaleProvider>
  );
}
