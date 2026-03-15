"use client";

import DebuggableDiv from "@/components/debuggable/Div";
import { cn } from "@/utils";
import type { TemplatePageProps } from "@/cms/types/template-page-props";
import { usePage } from "@/cms/page-context";

export default function AboutPage({ locale, globalData, page, singleItem }: TemplatePageProps) {

  const { debug, setDebug } = usePage();

  let className = "flex flex-col";
  className += " flex-1";
  className += " structure";
  // className += " overflow-y-auto";
  // className += " h-full";

  return (
    <DebuggableDiv 
      debug={debug} 
      id="about-page" 
      className={className}
      // className="flex flex-col h-full"
    >
      <DebuggableDiv 
        debug={debug} 
        id="about-page-content" 
        className={cn("flex flex-col")}
      >

        <p>Locale: {locale}</p>
        <p>Global Data: </p>
        <pre>
          <code>
            {globalData ? JSON.stringify(globalData, null, 2) : "No global data"}
          </code>
        </pre>
        <p>About Data: </p>
        <pre>
          <code>
            {singleItem ? JSON.stringify(singleItem, null, 2) : "No about data"}
          </code>
        </pre>

      </DebuggableDiv>
    </DebuggableDiv>
  );
}