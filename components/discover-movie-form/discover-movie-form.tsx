"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const discoverQuerySchema = z.object({
    query: z.string().min(1, "Query must be at least 1 character long"),
});


type DicoverMovieFormProps = {
    initialQuery?: string;
};

export default function DiscoverMovieForm({ initialQuery }: DicoverMovieFormProps) {

    const router = useRouter();
    
    const discoverQueryForm = useForm<z.infer<typeof discoverQuerySchema>>({
        resolver: zodResolver(discoverQuerySchema),
        defaultValues: {
            query: initialQuery ?? "",
        },
    });

    function onSubmit(data: z.infer<typeof discoverQuerySchema>) {
        const params = new URLSearchParams({
            query: data.query 
        });
        router.push(`/discover/movies?${params.toString()}`);
    }

    return (
        <form onSubmit={discoverQueryForm.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="query"
                    control={discoverQueryForm.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="query">Search for a movie to discover</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id="query"
                                    placeholder="Avengers, The Matrix, Inception..."
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    />
                                <InputGroupAddon align="inline-end">
                                    <SearchIcon/>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
        </form>
    );
}