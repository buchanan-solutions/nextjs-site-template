import type { Global, Home, Menu } from "@/cms/types";
import DebuggableDiv from "@/components/debuggable/Div";
import DebuggableFooter from "@/components/debuggable/Footer";
import DebuggableHeader from "@/components/debuggable/Header";
import { cn } from "@/utils";

export interface HomePageProps {
  locale: string;
  globalData: Global | null;
  homeData: Home | null;
  menuData: Menu | null;
}

export default function HomePage({ locale, globalData, homeData, menuData }: HomePageProps) {

  let className = "flex flex-col";
  className += " flex-1";
  // className += " overflow-y-auto";
  // className += " h-full";

  return (
    <DebuggableDiv 
      debug 
      id="home-page" 
      className={className}
      // className="flex flex-col h-full"
    >
      <DebuggableHeader debug id="home-page-header" className="flex flex-col">
        <h1>Home Page my man</h1>
      </DebuggableHeader>
      <DebuggableDiv debug id="home-page-content" className={cn("flex flex-col", (false ? "h-full" : "h-[1800px]"))}>

        <p>Locale: {locale}</p>
        <p>Global Data: {globalData ? globalData?.siteName : "No global data"}</p>
        <p>Home Data: {homeData ? homeData?.Letter : "No home data"}</p>

      </DebuggableDiv>
      <DebuggableFooter debug id="home-page-footer" className="flex flex-col h-full">
        <p>Footer</p>
      </DebuggableFooter>
    </DebuggableDiv>
  );
}