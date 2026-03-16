// ./src/templates/header.tsx
"use client";

import { Menu, Global } from "@/cms/types";
import DebuggableHeader from "@/components/debuggable/Header";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generatePageHref } from "@/cms/utils/generate-page-href";
import { useCMS } from "@/providers/cms-provider";
import { HeaderNav } from "@/components/nav/header-nav";
import { Content } from "@/components/content/Content";

export interface HeaderProps {
    locale: string;
    globalData: Global | null;
    menuData: Menu | null;
}

export default function Header({ locale, globalData, menuData }: HeaderProps) {
    const debugPrintMenuItems = () => {
        console.log(menuData?.items);
    }

    const { debugHeader } = useCMS();

    let headerClassName = "flex sticky justify-between top-0 z-50";
    headerClassName += " bg-background/40 backdrop-blur-md p-4";
    headerClassName += " structure";

    return (
        <DebuggableHeader
            debug={debugHeader}
            id="site-header"
            className={headerClassName}
        >
            <Content
                className="flex flex-1 justify-between items-center"
                defaults={{
                    left: (
                        <Link href={`/${locale}`} className="no-underline">
                            <h1 className="text-primary">{globalData?.siteName || "Site Name"}</h1>
                        </Link>
                    ),
                    center: <HeaderNav menu={menuData} />,
                    right: <ThemeToggle />,
                }} 
                slotClasses={{
                    center: "flex-1 flex justify-end min-w-0",
                }}
                debug={debugHeader}
            />
            {/* <h1 className="text-primary">{globalData?.siteName || "Site Name"}</h1>
            <Button className="cursor-pointer" variant="outline" onClick={debugPrintMenuItems} size="sm">
                <p className="my-auto">Debug</p>
            </Button>
            <HeaderNav menu={menuData} />
            <ThemeToggle /> */}
        </DebuggableHeader>
    );
}