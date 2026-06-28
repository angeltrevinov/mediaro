"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { resetPassword } from "@/lib/services/client/auth-service";

const resetPasswordSchema = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters").max(128, "Current password must be at most 128 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters").max(128, "New password must be at most 128 characters"),
    confirmNewPassword: z.string().min(6, "Confirm new password must be at least 6 characters").max(128, "Confirm new password must be at most 128 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm new password must match",
    path: ["confirmNewPassword"],
});

export function ResetPasswordForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        mode: "onChange",
    });

    async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
        setServerError(null);
        setLoading(true);
        try {
            await resetPassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            router.refresh();
            router.push(routes.auth.login);
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">Enter your current password and a new password to reset your password.</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {serverError && (
                    <p role="alert" className="text-sm text-destructive">
                        {serverError}
                    </p>
                )}
                <Controller
                    control={form.control}
                    name="currentPassword"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Current Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                type="password"
                                aria-invalid={fieldState.invalid}
                                placeholder="••••••••"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                New Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                type="password"
                                aria-invalid={fieldState.invalid}
                                placeholder="••••••••"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Confirm New Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                type="password"
                                aria-invalid={fieldState.invalid}
                                placeholder="••••••••"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !form.formState.isValid}
                >
                    {loading ? "Resetting…" : "Reset Password"}
                </Button>
            </form>
        </div>
    );
}