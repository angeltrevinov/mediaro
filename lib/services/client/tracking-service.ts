import { TrackingStatus, MediaType } from "@/generated/prisma/browser";
import { apiRoutes } from "@/lib/routes";
import { requestJson, requestNoContent } from "@/lib/services/client/http-client";

export type TrackingItem = {
    id: number;
    status: TrackingStatus;
    rating: number | null;
    started_date: string | null;
    completed_date: string | null;
    notes?: string | null;
    media: {
        id?: number;
        external_id: string;
        media_source?: string;
        media_type: string;
        title?: string | null;
        poster_path?: string | null;
    };
};

export type SaveTrackingPayload = {
    externalId: string;
    mediaSource: string;
    mediaType: MediaType;
    status: TrackingStatus;
    rating?: number;
    startedDate?: string;
    completedDate?: string;
    notes?: string;
};

export type UpdateTrackingPayload = Omit<SaveTrackingPayload, "externalId" | "mediaSource" | "mediaType">;

export async function listTracking(): Promise<TrackingItem[]> {
    return requestJson<TrackingItem[]>(apiRoutes.tracking.root);
}

export async function getTrackingByExternalId(externalId: string) {
    return requestJson<TrackingItem | null>(apiRoutes.tracking.byExternalId(externalId));
}

export async function createTracking(payload: SaveTrackingPayload) {
    return requestJson<TrackingItem>(apiRoutes.tracking.root, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function updateTracking(externalId: string, payload: UpdateTrackingPayload) {
    return requestJson<TrackingItem>(apiRoutes.tracking.byExternalId(externalId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function deleteTracking(externalId: string) {
    await requestNoContent(apiRoutes.tracking.byExternalId(externalId), {
        method: "DELETE",
    });
}
