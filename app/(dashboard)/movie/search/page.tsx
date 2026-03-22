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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MovieSearchResult } from "@/interfaces/movie";

const searchFormSchema = z.object({
    query: z.string().min(1, "Should not be empty"),
    page: z.number().min(1),
});

export default function SearchMoviePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [searchResults, setSearchResults] =
        useState<MovieSearchResult | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof searchFormSchema>>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
            query: "",
            page: 1,
        },
    });

    useEffect(() => {
        const query = (searchParams.get("query") ?? "").trim();
        const pageRaw = Number(searchParams.get("page") ?? "1");
        const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

        form.setValue("query", query);
        form.setValue("page", page);

        if (query) {
            fetchPage(query, page);
        }
    }, [searchParams, form]);

    async function fetchPage(query: string, page: number) {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/movie/search?query=${encodeURIComponent(query)}&page=${page}`,
            );
            if (!response.ok) {
                throw new Error(
                    `Error searching movies: ${response.statusText}`,
                );
            }
            const results = (await response.json()) as MovieSearchResult;
            setSearchResults(results);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    function onSubmit(data: z.infer<typeof searchFormSchema>) {
        const query = data.query.trim();
        if (!query) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("query", query);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }

    function generatePageLink(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("query", form.getValues("query") ?? "");
        params.set("page", page.toString());
        return `${pathname}?${params.toString()}`;
    }

    return (
        <div className="flex flex-col gap-4">
            {renderSearchInput()}
            <section className="flex flex-col gap-2">
                {renderMediaSearchResults()}
            </section>
        </div>
    );

    function renderSearchInput() {
        return (
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-2">
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
        );

    }

    function renderMediaSearchResults() {
        if (!loading && !searchResults) {
            return <p>Start by searching for a movie above.</p>;
        }
        if (loading) {
            return <p>Loading...</p>;
        }
        if (!searchResults || searchResults.results.length === 0) {
            return <p>No results found.</p>;
        }
        return (
            <>
                <span className="text-sm text-muted-foreground">
                    {searchResults.totalResults} results found
                </span>
                {searchResults.results.map((movie) => (
                    <Link
                        key={movie.id}
                        href={`/movie/${movie.id}?back=${encodeURIComponent(
                            searchParams.toString()
                                ? `${pathname}?${searchParams.toString()}`
                                : pathname
                        )}`}
                    >
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
                ))}
                {renderPagination()}
            </>
        );
    }

    function renderPagination() {
        if (!searchResults || searchResults.totalPages <= 1) {
            return null;
        }
        return (
            <div className="grid grid-cols-3 w-full md:w-1/3 mx-auto items-center justify-items-center mt-4 gap-2">
                <Button
                    className={
                        "justify-self-start " +
                        (searchResults.page <= 1
                            ? "invisible pointer-events-none"
                            : "")
                    }
                    asChild
                    variant="link"
                    size="sm"
                >
                    <Link
                        href={generatePageLink(searchResults.page - 1)}
                        aria-hidden={searchResults.page <= 1}
                        tabIndex={searchResults.page <= 1 ? -1 : 0}
                    >
                        Previous
                    </Link>
                </Button>
                <span className="inline-flex items-center text-sm text-muted-foreground">
                    Page {searchResults.page} of {searchResults.totalPages}
                </span>
                <Button
                    className={
                        "justify-self-end " +
                        (searchResults.page >= searchResults.totalPages
                            ? "invisible pointer-events-none"
                            : "")
                    }
                    asChild
                    variant="link"
                    size="sm"
                >
                    <Link
                        href={generatePageLink(searchResults.page + 1)}
                        aria-hidden={
                            searchResults.page >= searchResults.totalPages
                        }
                        tabIndex={
                            searchResults.page >= searchResults.totalPages
                                ? -1
                                : 0
                        }
                    >
                        Next
                    </Link>
                </Button>
            </div>
        );
    }
}
