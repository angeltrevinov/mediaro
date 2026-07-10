import type { Route } from "next";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default function SettingsPage() {
    redirect(routes.dashboard.settings.account as Route);
}
