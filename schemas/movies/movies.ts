import { z } from "zod";

export const Movie = z.object({
    id: z.number(),
    title: z.string(),
    overview: z.string().nullish(),
    release_date: z.string().nullish(),
    poster_path: z.string().nullish(),
    backdrop_path: z.string().nullish(),
});

export const MovieDiscoverQuery = z.object({
    query: z.string(),
    page: z.coerce.number().default(1)
});

export const MovieDiscoverResult = z.object({
    page: z.number(),
    results: z.array(Movie),
    total_pages: z.number(),
    total_results: z.number(),
});

export type Movie = z.infer<typeof Movie>;
export type MovieDiscoverQuery = z.infer<typeof MovieDiscoverQuery>;
export type MovieDiscoverResult = z.infer<typeof MovieDiscoverResult>;
