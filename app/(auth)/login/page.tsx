"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel  } from "@/components/ui/field";
import { ErrorMessage } from "@/components/error-message/error-message";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import * as z from "zod";
import { authenticateUser } from "@/services/auth";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

export default function LoginPage() {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    async function onSubmit(data: z.infer<typeof loginFormSchema>) {
        setErrorMessage(null);
        try {
            await authenticateUser(data.email, data.password);
            router.push("/");
        } catch (error) {
            console.error("Error logging in:", error);
            setErrorMessage("Unable to log in. Check your email and password and try again.");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {errorMessage && (
                        <ErrorMessage
                            title="Login failed"
                            message={errorMessage}
                        />
                    )}
                    <form onSubmit={loginForm.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={loginForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="email">Email:</FieldLabel>
                                    <Input
                                        {...field}
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                    />
                                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                </Field>
                            )}
                        ></Controller>
                        <Controller
                            name="password"
                            control={loginForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password">Password:</FieldLabel>
                                    <Input
                                        {...field}
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                    />
                                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                </Field>
                            )}
                        ></Controller>
                        <FieldGroup>
                            <Field>
                                <Button type="submit">Login</Button>
                            </Field>
                            <FieldDescription className="px-6 text-center">
                                Don&apos;t have an account? <Link href="/register">Register here</Link>
                            </FieldDescription>
                        </FieldGroup>
                    </FieldGroup>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}