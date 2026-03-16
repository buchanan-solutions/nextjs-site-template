// ./src/templates/footer.tsx
"use client";

import Link from "next/link";
import { Menu, Global, Footer } from "@/cms/types";
import { Content } from "@/components/content/Content";
import DebuggableDiv from "@/components/debuggable/Div";
import DebuggableFooter from "@/components/debuggable/Footer";
import { useCMS } from "@/providers/cms-provider";

export interface FooterProps {
    locale: string;
    globalData: Global | null;
    menuData: Menu | null;
    footerData: Footer | null;
}

export default function FooterComponent({ locale, globalData, menuData, footerData }: FooterProps) {

    const { debugFooter } = useCMS();

    let className = "flex flex-col bottom-0 z-50 bg-background text-primary p-4";
    className += " structure";
    className += " mt-auto";

    const CORPORATE_LINK_CLASSNAMES = "text-xs hover:underline whitespace-nowrap";

    return (
        <DebuggableFooter
            debug={debugFooter}
            id="site-footer"
            className={className}
        >
            <DebuggableDiv debug={debugFooter} id="footer-top">
                <p>This is the footer top</p>
            </DebuggableDiv>
            {/* Copyright */}
            <DebuggableDiv
                debug={debugFooter}
                id="footer-bottom"
                className="border-t border-foreground/70 p-2"
            >
                <Content
                    // className="flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0"
                    // slotClasses={{
                    //     left: "text-center md:text-left text-xs flex flex-col gap-4 md:gap-2",
                    //     right: "flex flex-col items-center gap-4 md:flex-row md:items-center",
                    // }}
                    variant="centered"
                    defaults={{
                        left: (
                            <p className="text-xs my-auto">
                                Website developed by{" "}
                                <Link
                                    href="https://buchanansolutions.ca"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    Buchanan Solutions
                                </Link>
                            </p>
                        ),
                        center: (
                            <>
                                {globalData?.companyLegalName && (
                                    <p className="text-sm my-auto">
                                        © {new Date().getFullYear()} {globalData.companyLegalName || "Company Name"}
                                    </p>
                                )}
                            </>
                        ),
                        right: footerData?.legalLinks.map((link) => (
                            <Link
                                key={link.id}
                                href={link.page?.slug ? `/${locale}/${link.page.slug}` : link.href ? link.href : "#"}
                                className={CORPORATE_LINK_CLASSNAMES}
                            >
                                {link.label}
                            </Link>
                        )),
                    }}
                />
            </DebuggableDiv>
        </DebuggableFooter>
    );
}