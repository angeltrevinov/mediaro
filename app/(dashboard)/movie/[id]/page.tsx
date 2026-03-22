"use client";

import { Movie } from "@/interfaces/movie";
import { useEffect, useState } from "react";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ClockIcon, StarIcon } from "lucide-react";
import {
    MediaDetails,
    MediaDetailsBackdrop,
    MediaDetailsGenre,
    MediaDetailsGenres,
    MediaDetailsHeader,
    MediaDetailsHeaderContent,
    MediaDetailsHeaderSubtitle,
    MediaDetailsHeaderTitle,
    MediaDetailsMeta,
    MediaDetailsMetaItem,
    MediaDetailsOverview,
    MediaDetailsPoster,
} from "@/components/media-details";

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
        <MediaDetails>
            {/* Backdrop */}
            <MediaDetailsBackdrop src={backdropUrl} alt={`${movie.title} backdrop`} backHref={backHref} />

            {/* Main content: poster + details */}
            <MediaDetailsHeader>
                {/* Poster */}
                <MediaDetailsPoster src={posterUrl} alt={`${movie.title} poster`} />

                {/* Title & meta */}
                <MediaDetailsHeaderContent>
                    <div>
                        <MediaDetailsHeaderTitle>
                            {movie.title}
                        </MediaDetailsHeaderTitle>
                        {movie.originalTitle !== movie.title && (
                            <MediaDetailsHeaderSubtitle>
                                {movie.originalTitle}
                            </MediaDetailsHeaderSubtitle>
                        )}
                    </div>

                    {movie.genres && movie.genres.length > 0 && (
                        <MediaDetailsGenres>
                            {movie.genres.map((genre) => (
                                <MediaDetailsGenre key={genre}>{genre}</MediaDetailsGenre>
                            ))}
                        </MediaDetailsGenres>
                    )}

                    <MediaDetailsMeta>
                        {movie.voteAverage !== undefined && (
                            <MediaDetailsMetaItem icon={<StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />}>
                                <span className="font-medium text-foreground">
                                    {movie.voteAverage.toFixed(1)}
                                </span>
                                {movie.voteCount !== undefined && (
                                    <span>({movie.voteCount.toLocaleString()} votes)</span>
                                )}
                            </MediaDetailsMetaItem>
                        )}
                        {movie.runtime !== undefined && movie.runtime > 0 && (
                            <MediaDetailsMetaItem icon={<ClockIcon className="w-4 h-4" />}>
                                {formatRuntime(movie.runtime)}
                            </MediaDetailsMetaItem>
                        )}
                        {movie.releaseDate && (
                            <MediaDetailsMetaItem icon={<CalendarIcon className="w-4 h-4" />}>
                                {formatReleaseYear(movie.releaseDate)}
                            </MediaDetailsMetaItem>
                        )}
                        {movie.status && (
                            <Badge variant="outline">{movie.status}</Badge>
                        )}
                    </MediaDetailsMeta>
                </MediaDetailsHeaderContent>
            </MediaDetailsHeader>

            <Separator />

            {movie.overview && (
                <MediaDetailsOverview>{movie.overview}</MediaDetailsOverview>
            )}
        </MediaDetails>
    );
}
