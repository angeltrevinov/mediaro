import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

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