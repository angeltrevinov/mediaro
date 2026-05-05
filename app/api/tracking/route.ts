import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MediaType, TrackingStatus } from "@/generated/prisma/enums";
import { NextRequest } from "next/server";
import { z } from "zod";

const trackingSchema = z.object({
    externalId: z.string().min(1, "External ID is required"),
    mediaSource: z.string().min(1, "Media source is required"),
    mediaType: z.enum(MediaType),
    status: z.enum(TrackingStatus),
    rating: z.number().min(0, "Rating must be at least 0").max(10, "Rating must be at most 10").optional(),
    startedDate: z.string().optional(),
    completedDate: z.string().optional(),
    notes: z.string().optional(),
});
export async function POST(request: NextRequest) {
    let bodyh: unknown;
    try {
        bodyh = await request.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid or missing JSON body" }),
            { status: 400 },
        );
    }

    const result = trackingSchema.safeParse(bodyh);
    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            { status: 400 },
        );
    }
    const { externalId, mediaSource, mediaType, status, rating, startedDate, completedDate, notes } = result.data;

    const user = getUserFromRequest(request);
    console.log("Authenticated user:", user);
    if (!user) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 },
        );
    }

    try {
        let media = await prisma.media.findUnique({ where: { external_id: externalId } });
        if (!media) {
            media = await prisma.media.create({
                data: {
                    external_id: externalId,
                    media_source: mediaSource,
                    media_type: mediaType,
                },
            });
        }

        const existing = await prisma.tracking.findUnique({
            where: { user_id_media_id: { user_id: user.id, media_id: media.id } },
        });
        if (existing) {
            return new Response(
                JSON.stringify({ error: "Tracking entry already exists" }),
                { status: 409 },
            );
        }

        const tracking = await prisma.tracking.create({
            data: {
                user_id: user.id,
                media_id: media.id,
                status,
                rating,
                started_date: startedDate ? new Date(startedDate) : null,
                completed_date: completedDate ? new Date(completedDate) : null,
                notes,
            },
        });

        return new Response(JSON.stringify(tracking), { status: 201 });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500 },
        );
    }
}

export async function GET(request: NextRequest) {
    const user = getUserFromRequest(request);
    if (!user) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 },
        );
    }

    try {
        const trackings = await prisma.tracking.findMany({
            where: { user_id: user.id },
            include: { media: true },
        });
        return new Response(JSON.stringify(trackings), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500 },
        );
    }
}