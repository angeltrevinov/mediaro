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

async function enrichMissingMetadata(
    rawItems: EnrichedTrackingItem[]
): Promise<EnrichedTrackingItem[]> {
    const missingMetadata = rawItems.filter((item) => !item.metadata?.title);
    if (missingMetadata.length === 0) {
        return rawItems;
    }

    const enrichedItems = await Promise.all(
        missingMetadata.map(async (item) => {
            try {
                const movie = await getMovieDetails(item.media.external_id);
                return {
                    ...item,
                    metadata: {
                        title: movie.title ?? null,
                        posterPath: movie.posterPath ?? null,
                    },
                } satisfies EnrichedTrackingItem;
            } catch {
                return item;
            }
        })
    );

    const enrichedById = new Map(enrichedItems.map((item) => [item.id, item]));

    return rawItems.map((item) => enrichedById.get(item.id) ?? item);
}

export function useLibraryItems() {
    const [items, setItems] = useState<EnrichedTrackingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLibrary() {
            try {
                const rawItems = (await listTracking()) as TrackingItem[];
                const completeItems = await enrichMissingMetadata(rawItems);
                setItems(completeItems);
            } finally {
                setLoading(false);
            }
        }

        loadLibrary();
    }, []);

    return { items, loading };
}
