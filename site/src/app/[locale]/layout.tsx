// ./src/app/[locale]/layout.tsx

// Standard
import { ReactNode } from "react";


// import { Locale } from "@/lib/locale/locale";
// import { getLocaleAndDictionary } from "@/lib/locale/server-locale-utils";
import { LocaleProvider } from "@/providers/locale-provider";

import { loggerFactory } from "@/lib/logger/server/factory";
import { loadDictionary } from "@/lib/cms/utils/load-dictionary";
import DebuggableDiv from "@/components/debuggable/Div";
import { getLocales } from "@/lib/cms/utils/get-locales";
import { createStrapiClient } from "@/lib/cms/server/strapi-client";
import DebuggableHeader from "@/components/debuggable/Header";
import DebuggableFooter from "@/components/debuggable/Footer";

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

  log.info("Rendering LangLayout for locale: ", locale);

  // const globalData = await getGlobal(locale);
  // const menuItems = await getMenu(locale);
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
      <DebuggableDiv
        debug={debug}
        id="locale-layout"
        className={className}
      >
        <DebuggableHeader 
          debug={debug}
          id="site-header"
          className="flex flex-col sticky top-0 z-50 bg-blue-500"
        >
          <h1>Locale Layout Header</h1>
        </DebuggableHeader>
        {children}
        <DebuggableFooter
          debug={debug}
          id="site-footer"
          className="flex flex-col"
        >
          <p>Locale Layout Footer</p>
        </DebuggableFooter>
      </DebuggableDiv>
    </LocaleProvider>
  );
}
