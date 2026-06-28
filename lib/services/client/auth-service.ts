import { apiRoutes } from "@/lib/routes";
import { requestJson } from "@/lib/services/client/http-client";

export type LoginPayload = {
    username: string;
    password: string;
};

export type RegisterPayload = {
    username: string;
    name: string;
    password: string;
};

export type ResetPasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export async function login(payload: LoginPayload) {
    return requestJson<{ id: number; username: string; name: string; role: string }>(
        apiRoutes.auth.login,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }
    );
}

export async function register(payload: RegisterPayload) {
    return requestJson<{
        id: number;
        username: string;
        name: string;
        role: string;
        created_at: string;
    }>(apiRoutes.auth.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function updateAccountName(name: string) {
    return requestJson<{ message: string }>(apiRoutes.auth.account, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
}

export async function resetPassword(payload: ResetPasswordPayload) {
    return requestJson<{ message: string }>(apiRoutes.auth.resetPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}
