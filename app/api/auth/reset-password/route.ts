import { clearSessionCookie, getUserFromRequest } from "@/lib/auth";
import { errorResponse, jsonResponse, parseJsonBody } from "@/lib/api-route-helpers";
import { resetUserPassword } from "@/lib/services/server/auth-service";
import { NextRequest } from "next/server";
import { z } from "zod";

const resetPasswordSchema = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters").max(128, "Current password must be at most 128 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters").max(128, "New password must be at most 128 characters"),
});

export async function POST(request: NextRequest) {
    const parsed = await parseJsonBody(request, resetPasswordSchema);
    if ("response" in parsed) {
        return parsed.response;
    }
    const { currentPassword, newPassword } = parsed.data;

    const user = getUserFromRequest(request);
    if (!user) {
        return errorResponse("Unauthorized", 401);
    }

    const result = await resetUserPassword({
        userId: user.id,
        currentPassword,
        newPassword,
    });
    if (!result.ok) {
        if (result.error === "User not found") {
            return errorResponse(result.error, 404);
        }
        return errorResponse(result.error, 401);
    }

    await clearSessionCookie();

    return jsonResponse({ message: "Password updated successfully" });
}