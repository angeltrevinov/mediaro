"use client";

import { useEffect, useState } from "react";
import { type EnrichedTrackingItem } from "@/components/library-table";
import {
    listTracking,
    type TrackingItem,
} from "@/lib/services/client/tracking-service";
import { getMovieDetails } from "@/lib/services/client/movie-service";

async function enrichMissingMetadata(
    rawItems: EnrichedTrackingItem[]
): Promise<EnrichedTrackingItem[]> {
    const missingMetadata = rawItems.filter((item) => !item.media.title);
    if (missingMetadata.length === 0) {
        return rawItems;
    }

    const enrichedItems = await Promise.all(
        missingMetadata.map(async (item) => {
            try {
                const movie = await getMovieDetails(item.media.external_id);
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
