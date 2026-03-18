"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import {
    MediaCard,
    MediaCardContent,
    MediaCardDescription,
    MediaCardImage,
    MediaCardTitle,
} from "@/components/media-card";
import Link from "next/link";
import { MovieSearchResult } from "@/interfaces/movie";
import { useState } from "react";

const searchFormSchema = z.object({
    query: z.string().min(1, "Should not be empty"),
});


export default function AddMoviePage() {
    const [searchResults, setSearchResults] = useState<MovieSearchResult | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const form = useForm<z.infer<typeof searchFormSchema>>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
            query: "",
        },
    });

    async function onSubmit(data: z.infer<typeof searchFormSchema>) {
        const { query } = data;
        try {
            const response = await fetch(
                `/api/movies/search?query=${encodeURIComponent(query)}`,
            );
            if (!response.ok) {
                throw new Error(
                    `Error searching movies: ${response.statusText}`,
                );
            }
            const results = await response.json() as MovieSearchResult;
            setSearchResults(results);
            setHasSearched(true);
            console.log(results);
        } catch (error) {
            setHasSearched(true);
            console.error(error);
        }
    }

    return (
        <main className="flex flex-col gap-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                    control={form.control}
                    name="query"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name} hidden>
                                Search for movies
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Search movies..."
                                    type="search"
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        type="submit"
                                        aria-label="Search"
                                    >
                                        <SearchIcon />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </form>
            <section className="flex flex-col gap-2">
                {renderMediaSearchResults()}
            </section>
        </main>
    );

    function renderMediaSearchResults() {
        if (!hasSearched) {
            return <p>Start by searching for a movie above.</p>;
        }
        if (!searchResults || searchResults.results.length === 0) {
            return <p>No results found.</p>;
        }
        return searchResults.results.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
                <MediaCard>
                    <MediaCardImage
                        src={movie.posterPath || ""}
                        alt={movie.title}
                    />
                    <MediaCardContent>
                        <MediaCardTitle>{movie.title}</MediaCardTitle>
                        <MediaCardDescription>
                            {movie.overview}
                        </MediaCardDescription>
                    </MediaCardContent>
                </MediaCard>
            </Link>
        ));
    }
}
