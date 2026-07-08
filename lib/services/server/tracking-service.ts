import { MediaType, TrackingStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export type CreateTrackingInput = {
    userId: number;
    externalId: string;
    mediaSource: string;
    mediaType: MediaType;
    status: TrackingStatus;
    rating?: number;
    startedDate?: string;
    completedDate?: string;
    notes?: string;
};

export type UpdateTrackingInput = {
    userId: number;
    externalId: string;
    status: TrackingStatus;
    rating?: number;
    startedDate?: string;
    completedDate?: string;
    notes?: string;
};

async function upsertMediaDetails(input: {
    externalId: string;
    mediaSource: string;
    mediaType: MediaType;
}) {
    const existingMedia = await prisma.media.findUnique({
        where: { external_id: input.externalId },
    });

    if (!existingMedia) {
        return prisma.media.create({
            data: {
                external_id: input.externalId,
                media_source: input.mediaSource,
                media_type: input.mediaType,
            },
        });
    } else {
        return existingMedia;
    }
}

export async function listTrackingForUser(userId: number) {
    return prisma.tracking.findMany({
        where: { user_id: userId },
        include: { media: true },
    });
}

export async function getTrackingByExternalId(userId: number, externalId: string) {
    return prisma.tracking.findFirst({
        where: { user_id: userId, media: { external_id: externalId } },
        include: { media: true },
    });
}

export async function createTrackingEntry(input: CreateTrackingInput) {
    const media = await upsertMediaDetails({
        externalId: input.externalId,
        mediaSource: input.mediaSource,
        mediaType: input.mediaType,
    });

    const existing = await prisma.tracking.findUnique({
        where: {
            user_id_media_id: {
                user_id: input.userId,
                media_id: media.id,
            },
        },
    });

    if (existing) {
        return { ok: false as const, error: "Tracking entry already exists" as const };
    }

    const tracking = await prisma.tracking.create({
        data: {
            user_id: input.userId,
            media_id: media.id,
            status: input.status,
            rating: input.rating,
            started_date: input.startedDate ? new Date(input.startedDate) : null,
            completed_date: input.completedDate ? new Date(input.completedDate) : null,
            notes: input.notes,
        },
    });

    return { ok: true as const, tracking };
}

export async function updateTrackingEntry(input: UpdateTrackingInput) {
    const media = await prisma.media.findUnique({
        where: { external_id: input.externalId },
    });

    if (!media) {
        return { ok: false as const, error: "Media not found" as const };
    }

    const tracking = await prisma.tracking.update({
        where: {
            user_id_media_id: {
                user_id: input.userId,
                media_id: media.id,
            },
        },
        data: {
            status: input.status,
            rating: input.rating ?? null,
            started_date: input.startedDate ? new Date(input.startedDate) : null,
            completed_date: input.completedDate ? new Date(input.completedDate) : null,
            notes: input.notes ?? null,
        },
    });

    return { ok: true as const, tracking };
}

export async function deleteTrackingEntry(userId: number, externalId: string) {
    const media = await prisma.media.findUnique({
        where: { external_id: externalId },
    });

    if (!media) {
        return { ok: false as const, error: "Media not found" as const };
    }

    await prisma.tracking.delete({
        where: {
            user_id_media_id: {
                user_id: userId,
                media_id: media.id,
            },
        },
    });

    return { ok: true as const };
}
