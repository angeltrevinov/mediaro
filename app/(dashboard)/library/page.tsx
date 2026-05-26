"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnrichedTrackingItem, LibraryTable, LibraryTableEmpty } from "@/components/library-table";

export default function LibraryPage() {
    const router = useRouter();
    const [items, setItems] = useState<EnrichedTrackingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/tracking");
                if (!res.ok) return;
                const raw = (await res.json()) as EnrichedTrackingItem[];

                // Backfill display metadata for entries that pre-date the schema change
                const needsEnrich = raw.filter((item) => !item.media.title);
                if (needsEnrich.length > 0) {
                    const enriched = await Promise.all(
                        needsEnrich.map(async (item) => {
                            try {
                                const movieRes = await fetch(`/api/movie/${item.media.external_id}`);
                                if (!movieRes.ok) return item;
                                const movie = await movieRes.json();
                                return {
                                    ...item,
                                    media: {
                                        ...item.media,
                                        title: movie.title ?? item.media.title,
                                        poster_path: movie.posterPath ?? item.media.poster_path,
                                    },
                                } satisfies EnrichedTrackingItem;
                            } catch {
                                return item;
                            }
                        })
                    );
                    const enrichedIds = new Set(enriched.map((e) => e.id));
                    setItems([
                        ...raw.filter((item) => !enrichedIds.has(item.id)),
                        ...enriched,
                    ]);
                } else {
                    setItems(raw);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Library</h1>
            {items.length === 0 ? (
                <LibraryTableEmpty />
            ) : (
                <LibraryTable
                    items={items}
                    onRowClick={(item) =>
                        router.push(`/movie/${item.media.external_id}?back=/library`)
                    }
                />
            )}
        </div>
    );
}


