"use client";

import {
    MediaCard,
    MediaCardContent,
    MediaCardDescription,
    MediaCardImage,
    MediaCardTitle,
} from "@/components/media-card";
import {
    MediaSearchEmpty,
    MediaSearchForm,
    MediaSearchLoading,
    MediaSearchPagination,
    MediaSearchResultsCount,
} from "@/components/media-search";
import { useMediaSearch, type PaginatedResult } from "@/hooks/use-media-search";
import { type Movie } from "@/interfaces/movie";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

async function fetchMovies(query: string, page: number): Promise<PaginatedResult<Movie>> {
    const response = await fetch(
        `/api/movie/search?query=${encodeURIComponent(query)}&page=${page}`,
    );
    if (!response.ok) {
        throw new Error(`Error searching movies: ${response.statusText}`);
    }
    return response.json() as Promise<PaginatedResult<Movie>>;
}

export default function SearchMoviePage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const { form, results, loading, onSubmit, generatePageLink } =
        useMediaSearch<Movie>(fetchMovies);

    const hasSearched = !!searchParams.get("query");

    return (
        <div className="flex flex-col gap-4">
            <MediaSearchForm
                form={form}
                onSubmit={onSubmit}
                placeholder="Search movies..."
            />
            <section className="flex flex-col gap-2">
                {!hasSearched && !loading ? (
                    <MediaSearchEmpty message="Start by searching for a movie above." />
                ) : loading ? (
                    <MediaSearchLoading />
                ) : !results || results.results.length === 0 ? (
                    <MediaSearchEmpty message="No results found." />
                ) : (
                    <>
                        <MediaSearchResultsCount count={results.totalResults} />
                        {results.results.map((movie) => (
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
                        <MediaSearchPagination
                            currentPage={results.page}
                            totalPages={results.totalPages}
                            generatePageLink={generatePageLink}
                        />
                    </>
                )}
            </section>
        </div>
    );
}
