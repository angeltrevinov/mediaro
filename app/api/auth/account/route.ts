import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";

const updateAccountSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters"),
});

export async function PATCH(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid or missing JSON body" }),
            { status: 400 },
        );
    }

    const result = updateAccountSchema.safeParse(body);
    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            { status: 400 },
        );
    }
    const { name } = result.data;

    const user = await getCurrentUser();
    if (!user) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 },
        );
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { name },
    });

    return new Response(
        JSON.stringify({ message: "Name updated successfully" }),
        { status: 200 },
    );
}
