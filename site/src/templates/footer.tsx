// ./src/templates/footer.tsx
"use client";

import { Menu, Global } from "@/cms/types";
import DebuggableDiv from "@/components/debuggable/Div";
import DebuggableFooter from "@/components/debuggable/Footer";
import DebuggableHeader from "@/components/debuggable/Header";
import { useCMS } from "@/providers/cms-provider";

export interface FooterProps {
    globalData: Global | null;
    menuData: Menu | null;
}

export default function Footer({ globalData, menuData }: FooterProps) {

    const { debugFooter } = useCMS();

    let className = "flex flex-col bottom-0 z-50 bg-background text-primary p-4";
    className += " structure";
    className += " mt-auto";

    return (
        <DebuggableFooter
            debug={debugFooter}
            id="site-footer"
            className={className}
        >
            <DebuggableDiv debug={debugFooter} id="footer-top">
                <p>This is the footer top</p>
            </DebuggableDiv>
            <DebuggableDiv debug={debugFooter} id="footer-bottom">
                <p>This is the footer bottom</p>
            </DebuggableDiv>
        </DebuggableFooter>
    );
}