import { z } from "zod";

export const MovieSearchQuery = z.object({
    query: z.string(),
    page: z.coerce.number().optional(),
});

export const MovieSearchResult = z.object({
    page: z.number(),
    results: z.array(z.object({
        id: z.number(),
        title: z.string(),
        overview: z.string().nullish(),
        release_date: z.string().nullish(),
        poster_path: z.string().nullish(),
        backdrop_path: z.string().nullish(),
    })),
    total_pages: z.number(),
    total_results: z.number(),
});
