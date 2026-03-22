import { ResetPasswordForm } from "./reset-password";

export default function AccountSettingsPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p>Manage your account settings and preferences.</p>
            <ResetPasswordForm/>
        </div>
    );
}