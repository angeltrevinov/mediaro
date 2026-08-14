"use client";

import { useEffect, useState } from "react";
import {
    listTracking,
    type TrackingItem,
} from "@/lib/services/client/tracking-service";
import { getMovieDetails } from "@/lib/services/client/movie-service";

export type EnrichedTrackingItem = TrackingItem & {
    metadata?: {
        title: string | null;
        posterPath: string | null;
    };
};

async function fetchMetadata(item: EnrichedTrackingItem): Promise<EnrichedTrackingItem> {
    try {
        const movie = await getMovieDetails(item.media.external_id);
        return {
            ...item,
            metadata: {
                title: movie.title ?? null,
                posterPath: movie.posterPath ?? null,
            },
        };
    } catch {
        return item;
    }
}

async function enrichMissingMetadata(
    items: EnrichedTrackingItem[]
): Promise<EnrichedTrackingItem[]> {
    return Promise.all(
        items.map((item) => (item.metadata?.title ? item : fetchMetadata(item)))
    );
}

export function useLibraryItems() {
    const [items, setItems] = useState<EnrichedTrackingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLibrary() {
            try {
                const rawItems = (await listTracking()) as TrackingItem[];
                setItems(await enrichMissingMetadata(rawItems));
            } finally {
                setLoading(false);
            }
        }

        loadLibrary();
    }, []);

    return { items, loading };
}
