"use client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const registerFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export default function RegisterPage() {
    
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
        try {
            //await createUser(data.email, data.password, data.name);
            console.log("User created successfully");   
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account and start using Mediario.
                </CardDescription>
                <CardContent>
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
                                            <p className="text-sm text-destructive">
                                                {fieldState.error.message}
                                            </p>
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
                                            <p className="text-sm text-destructive">
                                                {fieldState.error.message}
                                            </p>
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
                                        />
                                        {fieldState.error && (
                                            <p className="text-sm text-destructive">
                                                {fieldState.error.message}
                                            </p>
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
                                        />
                                        {fieldState.error && (
                                            <p className="text-sm text-destructive">
                                                {fieldState.error.message}
                                            </p>
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
                </CardContent>
            </CardHeader>
        </Card>
    );
}