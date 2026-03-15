import { Menu, Global } from "@/cms/types";
import DebuggableHeader from "@/components/debuggable/Header";
import { ThemeToggle } from "@/components/theme-toggle";

export interface HeaderProps {
    globalData: Global | null;
    menuData: Menu | null;
}

const debug = false;

export default function Header({ globalData, menuData }: HeaderProps) {
    return (
        <DebuggableHeader
            debug={debug}
            id="site-header"
            className="flex sticky justify-between top-0 z-50 bg-background text-primary p-4"
        >
            <h1>{globalData?.siteName || "Site Name"}</h1>
            <ThemeToggle />
        </DebuggableHeader>
    );
}