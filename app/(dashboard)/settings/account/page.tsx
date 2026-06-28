import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account-form";
import { ResetPasswordForm } from "./reset-password";
import { routes } from "@/lib/routes";

export default async function AccountSettingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect(routes.auth.login);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p>Manage your account settings and preferences.</p>
            <AccountForm currentName={user.name} />
            <Separator />
            <ResetPasswordForm />
        </div>
    );
}
