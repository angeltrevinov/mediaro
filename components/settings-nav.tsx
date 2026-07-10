"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

type NavItem = { label: string; href: string };
type NavGroup = { label: string; href: string; children?: NavItem[] };

const navItems: NavGroup[] = [
    {
        label: "Account",
        href: routes.dashboard.settings.account,
        children: [
            { label: "Account Information", href: `${routes.dashboard.settings.account}#AccountInformation` },
            { label: "Reset Password", href: `${routes.dashboard.settings.account}#ResetPassword` },
        ],
    },
    {
        label: "Metadata Providers",
        href: routes.dashboard.settings.metadataProviders,
    },
];

export function SettingsNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <div key={item.href}>
                        <Link
                            href={(item.children ? item.children[0].href : item.href) as Route}
                            className={cn(
                                "block rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                        {item.children && (
                            <div className="ml-3 flex flex-col gap-0.5 border-l pl-3">
                                {item.children.map((child) => (
                                    <Link
                                        key={child.href}
                                        href={child.href as Route}
                                        className="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
