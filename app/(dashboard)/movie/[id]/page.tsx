"use client";

import { Movie } from "@/interfaces/movie";
import { useEffect, useState } from "react";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeftIcon, ClockIcon, StarIcon } from "lucide-react";

function formatRuntime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatReleaseYear(dateStr: string): string {
    return dateStr ? new Date(dateStr).getFullYear().toString() : "—";
}

export default function MovieDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const backHref = (() => {
        const raw = searchParams.get("back") ?? "";
        return raw.startsWith("/") ? raw : null;
    })();
    
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchMovieDetails(id);
        }
    }, [id]);

    async function fetchMovieDetails(movieId: string) {
        setLoading(true);
        try {
            const response = await fetch(`/api/movie/${movieId}`);
            if (!response.ok) {
                throw new Error(
                    `Error fetching movie details: ${response.statusText}`,
                );
            }
            const movieDetails = (await response.json()) as Movie;
            setMovie(movieDetails);
        } catch (error) {
            console.error(error);
            setMovie(null);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <p className="text-muted-foreground">Movie not found.</p>
            </div>
        );
    }

    const backdropUrl = movie.backdropPath ?? null;
    const posterUrl = movie.posterPath ?? null;

    return (
        <div className="flex flex-col gap-4 sm:gap-8">
            {/* Backdrop */}
            <div className="relative w-full h-48 sm:h-72 rounded-xl overflow-hidden bg-muted">
                {backdropUrl ? (
                    <img
                        src={backdropUrl}
                        alt={`${movie.title} backdrop`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
                {backHref && (
                    <div className="absolute top-3 left-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="bg-background/70 backdrop-blur-sm hover:bg-background/90"
                        >
                            <Link href={backHref}>
                                <ChevronLeftIcon />
                                Back
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            {/* Main content: poster + details */}
            <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-8 -mt-16 sm:-mt-48 px-2 sm:items-end">
                {/* Poster */}
                <div className="shrink-0 mx-auto sm:mx-0">
                    {posterUrl ? (
                        <img
                            src={posterUrl}
                            alt={`${movie.title} poster`}
                            className="w-32 h-48 sm:w-44 sm:h-64 rounded-xl shadow-xl border border-border object-cover"
                        />
                    ) : (
                        <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground text-sm shrink-0">
                            No image
                        </div>
                    )}
                </div>

                {/* Title & meta */}
                <div className="flex flex-col gap-3 sm:pb-1 min-w-0">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                            {movie.title}
                        </h1>
                        {movie.originalTitle !== movie.title && (
                            <p className="text-muted-foreground text-sm mt-0.5">
                                {movie.originalTitle}
                            </p>
                        )}
                    </div>

                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {movie.genres.map((genre) => (
                                <Badge key={genre} variant="secondary">
                                    {genre}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {movie.voteAverage !== undefined && (
                            <span className="flex items-center gap-1">
                                <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-medium text-foreground">
                                    {movie.voteAverage.toFixed(1)}
                                </span>
                                {movie.voteCount !== undefined && (
                                    <span>
                                        ({movie.voteCount.toLocaleString()} votes)
                                    </span>
                                )}
                            </span>
                        )}
                        {movie.runtime !== undefined && movie.runtime > 0 && (
                            <span className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                {formatRuntime(movie.runtime)}
                            </span>
                        )}
                        {movie.releaseDate && (
                            <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {formatReleaseYear(movie.releaseDate)}
                            </span>
                        )}
                        {movie.status && (
                            <Badge variant="outline">{movie.status}</Badge>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Overview */}
            {movie.overview && (
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold">Overview</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {movie.overview}
                    </p>
                </div>
            )}
        </div>
    );
}
