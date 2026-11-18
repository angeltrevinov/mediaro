import { z } from "zod";

export const Movie = z.object({
    // Internal id, assigned once the movie is stored in our database
    id: z.number().optional(),
    tmdb_id: z.string(),
    title: z.string(),
    overview: z.string().nullish(),
    release_date: z.string().nullish(),
    poster_path: z.string().nullish(),
    backdrop_path: z.string().nullish(),
    nsfw: z.boolean().nullish(),
    imdb_id: z.string().nullish(),
    origin_country: z.array(z.string()).nullish(),
    original_language: z.string().nullish(),
    original_title: z.string().nullish(),
    popularity: z.number().nullish(),
    runtime: z.number().nullish(),
    status: z.string().nullish(),
    vote_average: z.number().nullish(),
    vote_count: z.number().nullish(),
});

export const MovieDiscoverResult = z.object({
    page: z.number(),
    results: z.array(Movie),
    total_pages: z.number(),
    total_results: z.number(),
});

export type Movie = z.infer<typeof Movie>;
export type MovieDiscoverResult = z.infer<typeof MovieDiscoverResult>;

