import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function MediaDetails({children}: React.PropsWithChildren) {
    return (
        <div className="flex flex-col gap-4">
            {children}
        </div>
    );
}

type MediaDetailsBackdropProps = {
    src: string | null,
    alt: string,
    backHref?: string | null,
}
export function MediaDetailsBackdrop({ src, alt, backHref }: MediaDetailsBackdropProps) {
    return (
        <div className="relative w-full h-48 sm:h-72 rounded-xl overflow-hidden bg-muted">
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="100vw"
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-muted" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
            {backHref && (
                <div className="absolute top-3 left-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="bg-background/70 backdrop-blur-sm hover:bg-background/90"
                    >
                        <Link href={backHref as Route}>
                            <ChevronLeftIcon />
                            Back
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

export function MediaDetailsHeader({ children }: React.PropsWithChildren) {
    return (
        <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-8 -mt-16 sm:-mt-48 px-2 sm:items-end">
            {children}
        </div>
    );
}
type MediaDetailsPosterProps = {
    src: string | null,
    alt: string,
};
export function MediaDetailsPoster({ src, alt }: MediaDetailsPosterProps) {
    return (
        <div className="shrink-0 mx-auto sm:mx-0">
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    width={176}
                    height={256}
                    sizes="(min-width: 640px) 176px, 128px"
                    className="w-32 h-48 sm:w-44 sm:h-64 rounded-xl shadow-xl border border-border object-cover"
                />
            ) : (
                <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground text-sm shrink-0">
                    No image
                </div>
            )}
        </div>
    );
}

export function MediaDetailsHeaderContent({ children }: React.PropsWithChildren) {
    return (
        <div className="flex flex-col gap-3 sm:pb-1 min-w-0">
            {children}
        </div>
    );
}

export function MediaDetailsHeaderTitle({ children }: React.PropsWithChildren) {
    return (
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {children}
        </h1>
    );
}

export function MediaDetailsHeaderSubtitle({ children }: React.PropsWithChildren) {
    return (
        <div className="text-muted-foreground text-sm mt-0.5">
            {children}
        </div>
    );
}

export function MediaDetailsGenres({ children }: React.PropsWithChildren) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {children}
        </div>
    );
}

export function MediaDetailsGenre({ children }: React.PropsWithChildren) {
    return (
        <Badge variant="secondary">{children}</Badge>
    );
}

export function MediaDetailsMeta({ children }: React.PropsWithChildren) {
    return (
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {children}
        </div>
    );
}

type MediaDetailsMetaItemProps = React.PropsWithChildren<{
    icon?: React.ReactNode;
}>;

export function MediaDetailsMetaItem({ icon, children }: MediaDetailsMetaItemProps) {
    return (
        <span className="flex items-center gap-1">
            {icon}
            {children}
        </span>
    );
}

export function MediaDetailsSection({ children }: React.PropsWithChildren) {
    return (
        <div className="flex flex-col gap-2">
            {children}
        </div>
    );
}

export function MediaDetailsSectionTitle({ children }: React.PropsWithChildren) {
    return (
        <h2 className="text-lg font-semibold">{children}</h2>
    );
}

export function MediaDetailsOverview({ children }: React.PropsWithChildren) {
    return (
        <MediaDetailsSection>
            <MediaDetailsSectionTitle>Overview</MediaDetailsSectionTitle>
            <p className="text-muted-foreground leading-relaxed">{children}</p>
        </MediaDetailsSection>
    );
}