import DiscoverMovieForm from "@/components/discover-movie-form/discover-movie-form";
import { searchMovie } from "@/lib/tmdb";

type SearchParamsTypes = {
    query?: string;
};

export default async function Page({ searchParams }: { searchParams: Promise<SearchParamsTypes> }) {

    const params = await searchParams;

    const query = params.query ?? "";
    const data = query ? await searchMovie(query) : null;

    return (
        <div>
            <h1>Discover Movies</h1>
            <DiscoverMovieForm initialQuery={query} />

            {data && data.results.length > 0 && (
                <div>
                    <h2>Results for "{query}"</h2>
                    <ul>
                        {data.results.map((movie) => (
                            <li key={movie.id}>{movie.title}</li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}