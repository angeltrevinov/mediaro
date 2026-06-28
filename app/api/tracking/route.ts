import { requireUserFromRequest } from "@/lib/auth";
import { errorResponse, jsonResponse, parseJsonBody } from "@/lib/api-route-helpers";
import { MediaType, TrackingStatus } from "@/generated/prisma/enums";
import {
    createTrackingEntry,
    listTrackingForUser,
} from "@/lib/services/server/tracking-service";
import { NextRequest } from "next/server";
import { z } from "zod";

const trackingSchema = z.object({
    externalId: z.string().min(1, "External ID is required"),
    mediaSource: z.string().min(1, "Media source is required"),
    mediaType: z.enum(MediaType),
    title: z.string().optional(),
    posterPath: z.string().optional(),
    status: z.enum(TrackingStatus),
    rating: z.number().min(0, "Rating must be at least 0").max(10, "Rating must be at most 10").optional(),
    startedDate: z.string().optional(),
    completedDate: z.string().optional(),
    notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
    const parsed = await parseJsonBody(request, trackingSchema);
    if ("response" in parsed) {
        return parsed.response;
    }
    const { externalId, mediaSource, mediaType, title, posterPath, status, rating, startedDate, completedDate, notes } = parsed.data;

    const auth = requireUserFromRequest(request);
    if ("response" in auth) {
        return auth.response;
    }

    try {
        const result = await createTrackingEntry({
            userId: auth.user.id,
            externalId,
            mediaSource,
            mediaType,
            title,
            posterPath,
            status,
            rating,
            startedDate,
            completedDate,
            notes,
        });

        if (!result.ok) {
            return errorResponse("Tracking entry already exists", 409);
        }

        return jsonResponse(result.tracking, 201);
    } catch (error) {
        return errorResponse((error as Error).message, 500);
    }
}

export async function GET(request: NextRequest) {
    const auth = requireUserFromRequest(request);
    if ("response" in auth) {
        return auth.response;
    }

    try {
        const trackings = await listTrackingForUser(auth.user.id);
        return jsonResponse(trackings);
    } catch (error) {
        return errorResponse((error as Error).message, 500);
    }
}