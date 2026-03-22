"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(32, "Username must be at most 32 characters")
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Username can only contain letters, numbers, hyphens, and underscores",
        ),
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password must be at most 128 characters"),
});

export default function RegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: "", name: "", password: "" },
        mode: "onChange",
    });

    async function onSubmit(data: z.infer<typeof registerSchema>) {
        setServerError(null);
        setLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                router.refresh();
                router.push("/");
            } else {
                const body = await response.json();
                setServerError(
                    body.error ?? "Registration failed. Please try again.",
                );
            }
        } catch {
            setServerError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Fill in the details below to register.
                </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="flex flex-col gap-4">
                    {serverError && (
                        <p role="alert" className="text-sm text-destructive">
                            {serverError}
                        </p>
                    )}
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Full name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Jane Doe"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="username"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Username
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="your username"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Password
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
                </CardContent>
                <CardFooter className="flex flex-col gap-3 mt-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !form.formState.isValid}
                    >
                        {loading ? "Creating account…" : "Create account"}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </>
    );
}
