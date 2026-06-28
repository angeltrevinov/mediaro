import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser, deleteSession, clearSessionCookie } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

async function logout() {
    "use server";
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (token) {
        await deleteSession(token);
    }
    await clearSessionCookie();
    redirect(routes.auth.login);
}

export async function Nav() {
    const user = await getCurrentUser();

    return (
        <nav className="flex items-center justify-between p-3 mb-4 border-b">
            <Link href={routes.home} className="font-semibold text-lg">
                Trackarr
            </Link>
            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <Link href={routes.dashboard.search} className="text-sm text-muted-foreground">
                            search
                        </Link>
                        <Link href={routes.dashboard.library} className="text-sm text-muted-foreground">
                            library
                        </Link>
                        <Link href={routes.dashboard.settingsAccount} className="text-sm text-muted-foreground">
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
                            <Link href={routes.auth.login}>Login</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href={routes.auth.register}>Register</Link>
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
}
