"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { login } from "@/lib/services/client/auth-service";

const loginSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(32, "Username must be at most 32 characters")
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Username can only contain letters, numbers, hyphens, and underscores",
        ),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password must be at most 128 characters"),
});

export default function LoginPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
        mode: "onChange",
    });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        setServerError(null);
        setLoading(true);
        try {
            await login(data);
            router.refresh();
            router.push(routes.home);
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
        <>
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your credentials to sign in to your account.
                </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <CardContent className="flex flex-col gap-4">
                    {serverError && (
                        <p role="alert" className="text-sm text-destructive">
                            {serverError}
                        </p>
                    )}
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
                        {loading ? "Signing in…" : "Sign in"}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                        Don&apos;t have an account?{" "}
                        <Link
                            href={routes.auth.register}
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </>
    );
}
