"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Movie } from "@/interfaces/movie";
import {
    EnrichedTrackingItem,
    LibraryTable,
    LibraryTableEmpty,
    TrackingItem,
} from "@/components/library-table";

export default function LibraryPage() {
    const router = useRouter();
    const [items, setItems] = useState<EnrichedTrackingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/tracking");
                if (!res.ok) return;
                const trackings = (await res.json()) as TrackingItem[];

                const enriched = await Promise.all(
                    trackings.map(async (t) => {
                        try {
                            const movieRes = await fetch(`/api/movie/${t.media.external_id}`);
                            const movie = movieRes.ok
                                ? (await movieRes.json()) as Pick<Movie, "title" | "posterPath">
                                : null;
                            return { ...t, movie };
                        } catch {
                            return { ...t, movie: null };
                        }
                    })
                );

                setItems(enriched);
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

