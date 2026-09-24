"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { SearchIcon } from "lucide-react";

const discoverQuerySchema = z.object({
    query: z.string().min(1, "Query must be at least 1 character long"),
});

export default function DiscoverMovieForm() {
    
    const discoverQueryForm = useForm<z.infer<typeof discoverQuerySchema>>({
        resolver: zodResolver(discoverQuerySchema),
        defaultValues: {
            query: "",
        },
    });

    function onSubmit(data: z.infer<typeof discoverQuerySchema>) {
        console.log(data);
    }

    return (
        <form onSubmit={discoverQueryForm.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="query"
                    control={discoverQueryForm.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="query">Search for a movie</FieldLabel>
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