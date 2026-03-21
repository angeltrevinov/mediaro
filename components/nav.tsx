import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export async function Nav() {
    const user = await getCurrentUser();

    return (
        <nav className="flex items-center justify-between py-3 mb-4 border-b">
            <Link href="/" className="font-semibold text-lg">
                Trackarr
            </Link>
            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <span className="text-sm text-muted-foreground">
                            {user.name}
                        </span>
                        <LogoutButton />
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
