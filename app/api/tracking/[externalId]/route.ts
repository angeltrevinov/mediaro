import { TrackingStatus } from "@/generated/prisma/enums";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ externalId: string }> }
) {
    const { externalId } = await params;

    const user = getUserFromRequest(request);
    if (!user) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 },
        );
    }

    try {
        const trackingEntry = await prisma.tracking.findFirst({
            where: { user_id: user.id, media: { external_id: externalId } },
            include: { media: true },
        });
        return new Response(JSON.stringify(trackingEntry), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500 },
        );
    }
}

const trackingSchema = z.object({
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

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid or missing JSON body" }),
            { status: 400 },
        );
    }

    const result = trackingSchema.safeParse(body);
    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            { status: 400 },
        );
    }
    const { status, rating, startedDate, completedDate, notes } = result.data;

    const user = getUserFromRequest(request);
    if (!user) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 },
        );
    }

    try {
        const media = await prisma.media.findUnique({ where: { external_id: externalId } });
        if (!media) {
            return new Response(JSON.stringify({ error: "Media not found" }), { status: 404 });
        }

        const trackingEntry = await prisma.tracking.update({
            where: { user_id_media_id: { user_id: user.id, media_id: media.id } },
            data: {
                status,
                rating: rating ?? null,
                started_date: startedDate ? new Date(startedDate) : null,
                completed_date: completedDate ? new Date(completedDate) : null,
                notes: notes ?? null,
            },
        });
        return new Response(JSON.stringify(trackingEntry), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ externalId: string }> }
) {
    const { externalId } = await params;

    const user = getUserFromRequest(request);
    if (!user) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 },
        );
    }

    try {
        const media = await prisma.media.findUnique({ where: { external_id: externalId } });
        if (!media) {
            return new Response(JSON.stringify({ error: "Media not found" }), { status: 404 });
        }

        await prisma.tracking.delete({
            where: { user_id_media_id: { user_id: user.id, media_id: media.id } },
        });
        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500 },
        );
    }
}