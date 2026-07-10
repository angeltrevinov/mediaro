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
        <div className="flex flex-col gap-10">
            <section id="AccountInformation" className="flex flex-col gap-4">
                <AccountForm currentName={user.name} />
            </section>
            <Separator />
            <section id="ResetPassword" className="flex flex-col gap-4">
                <ResetPasswordForm />
            </section>
        </div>
    );
}
