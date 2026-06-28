"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateAccountName } from "@/lib/services/client/auth-service";

const updateAccountSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters"),
});

interface AccountFormProps {
    currentName: string;
}

export function AccountForm({ currentName }: AccountFormProps) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof updateAccountSchema>>({
        resolver: zodResolver(updateAccountSchema),
        defaultValues: {
            name: currentName,
        },
        mode: "onChange",
    });

    async function onSubmit(data: z.infer<typeof updateAccountSchema>) {
        setServerError(null);
        setSuccess(false);
        setLoading(true);
        try {
            await updateAccountName(data.name);
            setSuccess(true);
            router.refresh();
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
            <h2 className="text-xl font-bold">Account Information</h2>
            <p className="text-muted-foreground">Update your account information.</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {serverError && (
                    <p role="alert" className="text-sm text-destructive">
                        {serverError}
                    </p>
                )}
                {success && (
                    <p role="status" className="text-sm text-green-600">
                        Account updated successfully.
                    </p>
                )}
                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Your name"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Account"}
                </Button>
            </form>
        </div>
    );
}
