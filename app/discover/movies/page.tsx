import DiscoverMovieForm from "@/components/discover-movie-form/discover-movie-form";
import { MovieCard } from "@/components/movie-card/movie-card";
import { Movie } from "@/schemas/movies/movies";
import { discoverMovies } from "@/services/movies";

type SearchParamsTypes = {
    query?: string;
    page?: string;
};

export default async function Page({ searchParams }: { searchParams: Promise<SearchParamsTypes> }) {

    const params = await searchParams;
    const query = params.query ?? "";
    const page = parseInt(params.page ?? "1");

    let search = false;
    let movies: Movie[] = [];
    let totalResults: number | null = null;
    let errorMessage: string | null = null;

    if (query) {
        search = true;
        try {
            const movieDiscoverResult = await discoverMovies(query, page);
            movies = movieDiscoverResult.results;
            totalResults = movieDiscoverResult.total_results;
        } catch (error) {
            errorMessage = "Failed to fetch movie search results";
        }
    }

    return (
        <main className="container flex flex-col mx-auto py-8 gap-4">
            <h1>Discover Movies</h1>
            <DiscoverMovieForm initialQuery={query} />

            {!search && <p>Enter a movie name to search for it and add it to your list.</p>}

            {errorMessage && <p>{errorMessage}</p>}

            {search && movies.length === 0 && <p>No movies found for "{query}".</p>}

            {movies.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span>Found {totalResults} Results for "{query}"</span>
                    <ul className="flex flex-col gap-4">
                        {movies.map((movie) => (
                            <li key={movie.id}>
                                <MovieCard movie={movie} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </main>
    );
}