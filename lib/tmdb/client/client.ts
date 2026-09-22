import { TMDBMovieSearchResult, TMDBMovieSearchResultSchema } from "../schemas/schemas";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not set");
}

/**
 * Construct the options for the TMDB API endpoint
 * @param method - The HTTP method to use
 * @returns The options for the TMDB API endpoint
 */
function constructEndpointOptions(method: string = "GET"): RequestInit {
    const options = {
        method: method,
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_KEY}`
        }
    };
    return options;
}

/**
 * Searches for movies using the TMDB API based on a query string
 * @param query - The search query
 * @param page - The page number of the results
 * @param includeAdult - Whether to include adult content
 * @param language - The language of the results
 * @returns A promise resolving to the search results
 */
export async function searchMovie(
    query: string,
    page: number = 1,
    includeAdult: boolean = false,
    language: string = "en-US"
): Promise<TMDBMovieSearchResult> {
    try {
        const options = constructEndpointOptions("GET");
        const params = new URLSearchParams({
            query,
            page: String(page),
            include_adult: String(includeAdult),
            language,
        });
        const response = await fetch(
            `${TMDB_API_URL}/search/movie?${params}`,
            options
        );
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json()
        const movieSearchResponse = TMDBMovieSearchResultSchema.parse(data);
        return movieSearchResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
}