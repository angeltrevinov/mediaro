import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser, deleteSession, clearSessionCookie } from "@/lib/auth";
import { Button } from "@/components/ui/button";

async function logout() {
    "use server";
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (token) {
        await deleteSession(token);
    }
    await clearSessionCookie();
    redirect("/login");
}

export async function Nav() {
    const user = await getCurrentUser();

    return (
        <nav className="flex items-center justify-between p-3 mb-4 border-b">
            <Link href="/" className="font-semibold text-lg">
                Trackarr
            </Link>
            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <Link href="/search" className="text-sm text-muted-foreground">
                            search
                        </Link>
                        <Link href="/library" className="text-sm text-muted-foreground">
                            library
                        </Link>
                        <Link href="/settings/account" className="text-sm text-muted-foreground">
                            settings
                        </Link>
                        <form action={logout}>
                            <Button type="submit" variant="outline" size="sm">
                                Sign out
                            </Button>
                        </form>
                    </>
                ) : (
                    <>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href="/register">Register</Link>
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
}
