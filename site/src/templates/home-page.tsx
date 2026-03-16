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

const debug = false;

export default function HomePage({ locale, globalData, homeData, menuData }: HomePageProps) {

  let className = "flex flex-col";
  className += " flex-1";
  className += " structure";
  // className += " overflow-y-auto";
  // className += " h-full";

  return (
    <DebuggableDiv 
      debug={debug} 
      id="home-page" 
      className={className}
      // className="flex flex-col h-full"
    >
      <DebuggableDiv 
        debug={debug} 
        id="home-page-content" 
        className={cn("flex flex-col")}
      >

        <p>Locale: {locale}</p>
        <p>Global Data: {globalData ? JSON.stringify(globalData) : "No global data"}</p>
        <p>Home Data: {homeData ? homeData?.Letter : "No home data"}</p>

      </DebuggableDiv>
    </DebuggableDiv>
  );
}