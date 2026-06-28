import { requireUserFromRequest } from "@/lib/auth";
import { jsonResponse, parseJsonBody } from "@/lib/api-route-helpers";
import { updateAccountName } from "@/lib/services/server/auth-service";
import { NextRequest } from "next/server";
import { z } from "zod";

const updateAccountSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters"),
});

export async function PATCH(request: NextRequest) {
    const parsed = await parseJsonBody(request, updateAccountSchema);
    if ("response" in parsed) {
        return parsed.response;
    }
    const { name } = parsed.data;

    const auth = requireUserFromRequest(request);
    if ("response" in auth) {
        return auth.response;
    }

    await updateAccountName(auth.user.id, name);

    return jsonResponse({ message: "Name updated successfully" });
}
