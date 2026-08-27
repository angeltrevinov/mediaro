import { z } from "zod";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/**
 * Constructs a full image URL for a TMDB image based on its path and requested size.
 * @param path The image path from the TMDB API.
 * @param size The size of the image to request.
 * @returns The full image URL or null if the path is null.
 */
function constructTMDBImage(path: string | null, size: string): string | null {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export const TMDBMovieSchema = z.object({
    id: z.number(),
    title: z.string(),
    original_title: z.string(),
    overview: z.string(),
    popularity: z.number(),
    poster_path: z.string().nullable().transform(poster_path => constructTMDBImage(poster_path, 'w342')),
    backdrop_path: z.string().nullable().transform(backdrop_path => constructTMDBImage(backdrop_path, 'w780')),
    release_date: z.string(),
    adult: z.boolean(),
});

export type TMDBMovie = z.infer<typeof TMDBMovieSchema>;

export const TMDBMovieSearchResultSchema = z.object({
    page: z.number(),
    results: z.array(TMDBMovieSchema),
    total_pages: z.number(),
    total_results: z.number(),
});

export type TMDBMovieSearchResult = z.infer<typeof TMDBMovieSearchResultSchema>;