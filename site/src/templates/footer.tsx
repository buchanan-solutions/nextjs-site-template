import { Menu, Global } from "@/cms/types";
import DebuggableFooter from "@/components/debuggable/Footer";
import DebuggableHeader from "@/components/debuggable/Header";

export interface FooterProps {
    globalData: Global | null;
    menuData: Menu | null;
}

const debug = false;

export default function Footer({ globalData, menuData }: FooterProps) {
    return (
        <DebuggableFooter
            debug={debug}
            id="site-footer"
            className="flex flex-col bottom-0 z-50 bg-background text-primary p-4"
        >
            <h1>{globalData?.siteName || "Site Name"}</h1>
        </DebuggableFooter>
    );
}