"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MediaType, TrackingStatus } from "@/generated/prisma/browser";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export type TrackingData = {
    status: TrackingStatus;
    rating?: number | null;
    started_date?: string | Date | null;
    completed_date?: string | Date | null;
    notes?: string | null;
};

type MediaFormProps = {
    externalId: string;
    tracking?: TrackingData;
    onSuccess?: () => void;
};

const trackingFormSchema = z.object({
    externalId: z.string().min(1, "External ID is required"),
    mediaSource: z.string().min(1, "Media source is required"),
    mediaType: z.enum(MediaType),
    status: z.enum(TrackingStatus),
    rating: z
        .number()
        .min(1, "Rating must be at least 1")
        .max(10, "Rating must be at most 10")
        .optional(),
    startedDate: z.string().optional(),
    completedDate: z.string().optional(),
    notes: z.string().optional(),
});

type TrackingFormValues = z.infer<typeof trackingFormSchema>;

const STATUS_LABELS: Record<TrackingStatus, string> = {
    plan_to_watch: "Plan to Watch",
    watching: "Watching",
    completed: "Completed",
    dropped: "Dropped",
};

const STATUS_ORDER: TrackingStatus[] = [
    TrackingStatus.plan_to_watch,
    TrackingStatus.watching,
    TrackingStatus.completed,
    TrackingStatus.dropped,
];

function toDateInputValue(val?: string | Date | null): string {
    if (!val) return "";
    const d = typeof val === "string" ? new Date(val) : val;
    return d.toISOString().slice(0, 10);
}

export function MediaForm({ externalId, tracking, onSuccess }: MediaFormProps) {
    const isEdit = !!tracking;

    const form = useForm<TrackingFormValues>({
        resolver: zodResolver(trackingFormSchema),
        defaultValues: {
            externalId,
            mediaSource: "TMDB",
            mediaType: MediaType.movie,
            status: tracking?.status ?? TrackingStatus.plan_to_watch,
            rating: tracking?.rating ?? undefined,
            startedDate: toDateInputValue(tracking?.started_date),
            completedDate: toDateInputValue(tracking?.completed_date),
            notes: tracking?.notes ?? "",
        },
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    async function onSubmit(data: TrackingFormValues) {
        const body = {
            ...data,
            rating: data.rating ?? undefined,
            startedDate: data.startedDate || undefined,
            completedDate: data.completedDate || undefined,
            notes: data.notes || undefined,
        };

        const url = isEdit ? `/api/tracking/${externalId}` : `/api/tracking`;
        const method = isEdit ? "PATCH" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            onSuccess?.();
        } else {
            const errorData = await response.json() as { error?: string };
            form.setError("root", {
                message: errorData.error ?? "Something went wrong",
            });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FieldGroup>
                <Controller
                    control={control}
                    name="status"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid || undefined}>
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger id="status" aria-invalid={fieldState.invalid || undefined}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_ORDER.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {STATUS_LABELS[s]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="rating"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid || undefined}>
                            <FieldLabel htmlFor="rating">Rating</FieldLabel>
                            <Input
                                id="rating"
                                type="number"
                                min={1}
                                max={10}
                                step={1}
                                placeholder="1–10"
                                aria-invalid={fieldState.invalid || undefined}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                            />
                            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="startedDate"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid || undefined}>
                            <FieldLabel htmlFor="startedDate">Started Date</FieldLabel>
                            <Input
                                id="startedDate"
                                type="date"
                                aria-invalid={fieldState.invalid || undefined}
                                {...field}
                            />
                            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="completedDate"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid || undefined}>
                            <FieldLabel htmlFor="completedDate">Completed Date</FieldLabel>
                            <Input
                                id="completedDate"
                                type="date"
                                aria-invalid={fieldState.invalid || undefined}
                                {...field}
                            />
                            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="notes"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid || undefined}>
                            <FieldLabel htmlFor="notes">Notes</FieldLabel>
                            <Textarea
                                id="notes"
                                placeholder="Add any notes..."
                                aria-invalid={fieldState.invalid || undefined}
                                {...field}
                            />
                            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                        </Field>
                    )}
                />
            </FieldGroup>

            {errors.root && (
                <p className="text-sm text-destructive">{errors.root.message}</p>
            )}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEdit ? "Update" : "Add to Library"}
            </Button>
        </form>
    );
}
