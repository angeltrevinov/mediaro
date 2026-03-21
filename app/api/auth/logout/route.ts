import { cookies } from "next/headers";
import { deleteSession, clearSessionCookie } from "@/lib/auth";

export async function POST() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (token) {
        await deleteSession(token);
    }

    await clearSessionCookie();

    return new Response(
        JSON.stringify({ message: "Logged out" }),
        { status: 200 },
    );
}
