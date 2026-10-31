"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { ErrorMessage } from "@/components/error-message/error-message"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/better-auth/password-policy"
import { authClient } from "@/lib/better-auth/auth-client"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
      )
      .max(
        PASSWORD_MAX_LENGTH,
        `Password must be no more than ${PASSWORD_MAX_LENGTH} characters long`,
      ),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function ChangePasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: z.infer<typeof passwordFormSchema>) {
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const { error } = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        setErrorMessage(
          error.message || "Unable to change your password. Please try again.",
        )
        return
      }

      passwordForm.reset()
      setSuccessMessage("Your password has been changed.")
    } catch (error) {
      console.error("Error changing password:", error)
      setErrorMessage("Unable to change your password. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {errorMessage && (
            <ErrorMessage
              title="Password change failed"
              message={errorMessage}
            />
          )}
          {successMessage && (
            <p role="status" className="text-sm text-muted-foreground">
              {successMessage}
            </p>
          )}
          <form onSubmit={passwordForm.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="currentPassword"
                control={passwordForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="currentPassword">
                      Current password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      maxLength={PASSWORD_MAX_LENGTH}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="newPassword"
                control={passwordForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                    <Input
                      {...field}
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      maxLength={PASSWORD_MAX_LENGTH}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={passwordForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm new password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      maxLength={PASSWORD_MAX_LENGTH}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting
                  ? "Changing password..."
                  : "Change password"}
              </Button>
            </FieldGroup>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
