"use client";

import { TrackingStatus } from "@/generated/prisma/browser";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export type TrackingItem = {
    id: number;
    status: TrackingStatus;
    rating: number | null;
    started_date: string | null;
    completed_date: string | null;
    media: {
        external_id: string;
        media_type: string;
        title: string | null;
        poster_path: string | null;
    };
};

export type EnrichedTrackingItem = TrackingItem;

const STATUS_LABELS: Record<TrackingStatus, string> = {
    plan_to_watch: "Plan to Watch",
    watching: "Watching",
    completed: "Completed",
    dropped: "Dropped",
};

function formatDate(date: string | null): string {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
}

// --- Poster ---

type LibraryTablePosterProps = {
    src: string | null;
    alt: string;
    size?: "sm" | "lg";
};

export function LibraryTablePoster({ src, alt, size = "sm" }: LibraryTablePosterProps) {
    const cls = size === "lg" ? "w-12 h-18 rounded object-cover shrink-0" : "w-8 h-12 rounded object-cover shrink-0";
    if (src) {
        return (
            <img
                src={`https://image.tmdb.org/t/p/w92${src}`}
                alt={alt}
                className={cls}
            />
        );
    }
    return <div className={`${size === "lg" ? "w-12 h-18" : "w-8 h-12"} rounded bg-muted shrink-0`} />;
}

// --- Row ---

type LibraryTableRowProps = {
    item: EnrichedTrackingItem;
    onClick: () => void;
};

export function LibraryTableRow({ item, onClick }: LibraryTableRowProps) {
    return (
        <TableRow className="cursor-pointer" onClick={onClick}>
            <TableCell>
                <LibraryTablePoster
                    src={item.media.poster_path}
                    alt={item.media.title ?? item.media.external_id}
                />
            </TableCell>
            <TableCell className="font-medium">
                {item.media.title ?? item.media.external_id}
            </TableCell>
            <TableCell>
                <Badge variant="secondary">{STATUS_LABELS[item.status]}</Badge>
            </TableCell>
            <TableCell>{item.rating ?? "—"}</TableCell>
            <TableCell>{formatDate(item.started_date)}</TableCell>
            <TableCell>{formatDate(item.completed_date)}</TableCell>
        </TableRow>
    );
}

// --- Card (mobile) ---

type LibraryCardProps = {
    item: EnrichedTrackingItem;
    onClick: () => void;
};

export function LibraryCard({ item, onClick }: LibraryCardProps) {
    return (
        <div
            className="flex gap-3 rounded-xl border bg-card p-3 cursor-pointer hover:bg-accent transition-colors"
            onClick={onClick}
        >
            <LibraryTablePoster
                src={item.media.poster_path}
                alt={item.media.title ?? item.media.external_id}
                size="lg"
            />
            <div className="flex flex-col gap-1.5 min-w-0 justify-center">
                <p className="font-medium leading-tight truncate">
                    {item.media.title ?? item.media.external_id}
                </p>
                <Badge variant="secondary" className="w-fit">
                    {STATUS_LABELS[item.status]}
                </Badge>
                {item.rating && (
                    <p className="text-sm text-muted-foreground">Rating: {item.rating}/10</p>
                )}
                {(item.started_date || item.completed_date) && (
                    <p className="text-xs text-muted-foreground">
                        {item.started_date && <>Started {formatDate(item.started_date)}</>}
                        {item.started_date && item.completed_date && " · "}
                        {item.completed_date && <>Completed {formatDate(item.completed_date)}</>}
                    </p>
                )}
            </div>
        </div>
    );
}

// --- Empty ---

export function LibraryTableEmpty() {
    return (
        <div className="flex items-center justify-center min-h-64">
            <p className="text-muted-foreground">No items in your library yet.</p>
        </div>
    );
}

// --- Root ---

type LibraryTableProps = {
    items: EnrichedTrackingItem[];
    onRowClick: (item: EnrichedTrackingItem) => void;
};

export function LibraryTable({ items, onRowClick }: LibraryTableProps) {
    return (
        <>
            {/* Mobile: cards */}
            <div className="flex flex-col gap-3 md:hidden">
                {items.map((item) => (
                    <LibraryCard
                        key={item.id}
                        item={item}
                        onClick={() => onRowClick(item)}
                    />
                ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Started</TableHead>
                            <TableHead>Completed</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <LibraryTableRow
                                key={item.id}
                                item={item}
                                onClick={() => onRowClick(item)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

