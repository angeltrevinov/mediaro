import DiscoverMovieForm from "@/components/discover-movie-form/discover-movie-form";
import { searchMovie } from "@/lib/tmdb";
import { Movie, MovieDiscoverResult } from "@/schemas/movies/movies";

type SearchParamsTypes = {
    query?: string;
};

export default async function Page({ searchParams }: { searchParams: Promise<SearchParamsTypes> }) {

    const params = await searchParams;
    const query = params.query ?? "";

    let search = false;
    let movies: Movie[] = [];
    let errorMessage: string | null = null;

    if (query) {
        search = true;
        try {
            const movieDiscoverResult = await searchMovie(query);
            movies = movieDiscoverResult.results;
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
                <div>
                    <h2>Results for "{query}"</h2>
                    <ul>
                        {movies.map((movie) => (
                            <li key={movie.id}>{movie.title}</li>
                        ))}
                    </ul>
                </div>
            )}

        </main>
    );
}