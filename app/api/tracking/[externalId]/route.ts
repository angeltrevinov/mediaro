import { TrackingStatus } from "@/generated/prisma/enums";
import { requireUserFromRequest } from "@/lib/auth";
import { errorResponse, jsonResponse, parseJsonBody } from "@/lib/api-route-helpers";
import {
    deleteTrackingEntry,
    getTrackingByExternalId,
    updateTrackingEntry,
} from "@/lib/services/server/tracking-service";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ externalId: string }> }
) {
    const { externalId } = await params;

    const auth = requireUserFromRequest(request);
    if ("response" in auth) {
        return auth.response;
    }

    try {
        const trackingEntry = await getTrackingByExternalId(auth.user.id, externalId);
        return jsonResponse(trackingEntry);
    } catch (error) {
        return errorResponse((error as Error).message, 500);
    }
}

const trackingSchema = z.object({
    title: z.string().optional(),
    posterPath: z.string().optional(),
    status: z.enum(TrackingStatus),
    rating: z.number().min(0, "Rating must be at least 0").max(10, "Rating must be at most 10").optional(),
    startedDate: z.string().optional(),
    completedDate: z.string().optional(),
    notes: z.string().optional(),
});
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ externalId: string }> }
) {
    const { externalId } = await params;

    const parsed = await parseJsonBody(request, trackingSchema);
    if ("response" in parsed) {
        return parsed.response;
    }
    const { title, posterPath, status, rating, startedDate, completedDate, notes } = parsed.data;

    const auth = requireUserFromRequest(request);
    if ("response" in auth) {
        return auth.response;
    }

    try {
        const result = await updateTrackingEntry({
            userId: auth.user.id,
            externalId,
            title,
            posterPath,
            status,
            rating,
            startedDate,
            completedDate,
            notes,
        });

        if (!result.ok) {
            return errorResponse(result.error, 404);
        }

        return jsonResponse(result.tracking);
    } catch (error) {
        return errorResponse((error as Error).message, 500);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ externalId: string }> }
) {
    const { externalId } = await params;

    const auth = requireUserFromRequest(request);
    if ("response" in auth) {
        return auth.response;
    }

    try {
        const result = await deleteTrackingEntry(auth.user.id, externalId);
        if (!result.ok) {
            return errorResponse(result.error, 404);
        }
        return new Response(null, { status: 204 });
    } catch (error) {
        return errorResponse((error as Error).message, 500);
    }
}