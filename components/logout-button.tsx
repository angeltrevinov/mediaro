"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        try {
            const response = await fetch("/api/auth/logout", { method: "POST" });
            if (response.ok) {
                router.refresh();
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
            {loading ? "Signing out…" : "Sign out"}
        </Button>
    );
}
