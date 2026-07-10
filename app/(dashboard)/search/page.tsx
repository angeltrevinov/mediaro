"use client";

import {
    MediaCard,
    MediaCardAttribution,
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
import { Suspense } from "react";
import { searchMovies } from "@/lib/services/client/movie-service";

async function fetchMovies(query: string, page: number): Promise<PaginatedResult<Movie>> {
    return searchMovies(query, page);
}

function SearchMoviePageContent() {
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
                            <MediaCard key={movie.id}>
                                <MediaCardImage
                                    src={movie.posterPath || ""}
                                    alt={movie.title}
                                />
                                <div className="flex flex-1 flex-col min-w-0">
                                    <Link
                                        href={`/movie/${movie.id}?back=${encodeURIComponent(
                                            searchParams.toString()
                                                ? `${pathname}?${searchParams.toString()}`
                                                : pathname
                                        )}`}
                                        className="flex-1 block min-w-0"
                                    >
                                        <MediaCardContent>
                                            <MediaCardTitle>{movie.title}</MediaCardTitle>
                                            <MediaCardDescription>
                                                {movie.overview}
                                            </MediaCardDescription>
                                        </MediaCardContent>
                                    </Link>
                                    <MediaCardAttribution>
                                        The metadata for this media is provided by{" "}
                                        <a
                                            href="https://www.themoviedb.org/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline underline-offset-4 text-foreground hover:text-foreground/80"
                                        >
                                            TMDB
                                        </a>
                                    </MediaCardAttribution>
                                </div>
                            </MediaCard>
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

export default function SearchMoviePage() {
    return (
        <Suspense fallback={<MediaSearchLoading />}>
            <SearchMoviePageContent />
        </Suspense>
    );
}
