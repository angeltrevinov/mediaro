"use client";
import { useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { ErrorMessage } from "@/components/error-message/error-message";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import {
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
} from "@/lib/better-auth/password-policy";

const registerFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
        .max(PASSWORD_MAX_LENGTH, `Password must be no more than ${PASSWORD_MAX_LENGTH} characters long`),
    confirmPassword: z
        .string()
        .min(PASSWORD_MIN_LENGTH, `Confirm Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
        .max(PASSWORD_MAX_LENGTH, `Confirm Password must be no more than ${PASSWORD_MAX_LENGTH} characters long`)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export default function RegisterPage() {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const registerForm = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    async function onSubmit(data: z.infer<typeof registerFormSchema>) {
        setErrorMessage(null);
        try {
            await createUser(data.email, data.password, data.name);
            router.push("");
        } catch (error) {
            console.error("Error creating user:", error);
            setErrorMessage("Unable to create your account. Please try again.");
        }
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account and start using Mediario.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {errorMessage && (
                        <ErrorMessage
                            title="Registration failed"
                            message={errorMessage}
                        />
                    )}
                    <form onSubmit={registerForm.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={registerForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">Name:</FieldLabel>
                                        <Input
                                            {...field}
                                            id="name"
                                            placeholder="John Doe"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="name"
                                        />
                                        {fieldState.error && (
                                            <FieldError>
                                                {fieldState.error.message}
                                            </FieldError>
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={registerForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email:</FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            placeholder="john.doe@example.com"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="email"
                                            type="email"
                                        />
                                        {fieldState.error && (
                                            <FieldError>
                                                {fieldState.error.message}
                                            </FieldError>
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={registerForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">Password:</FieldLabel>
                                        <Input
                                            {...field}
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="new-password"
                                            maxLength={PASSWORD_MAX_LENGTH}
                                        />
                                        {fieldState.error && (
                                            <FieldError>
                                                {fieldState.error.message}
                                            </FieldError>
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={registerForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="confirmPassword">Confirm Password:</FieldLabel>
                                        <Input
                                            {...field}
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="new-password"
                                            maxLength={PASSWORD_MAX_LENGTH}
                                        />
                                        {fieldState.error && (
                                            <FieldError>
                                                {fieldState.error.message}
                                            </FieldError>
                                        )}
                                    </Field>
                                )}
                            />
                            <FieldGroup>
                                <Field>
                                    <Button type="submit">Create Account</Button>
                                </Field>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account? <Link href="/login">Log in</Link>
                                </FieldDescription>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}