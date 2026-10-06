import { Movie } from "@/schemas/movies/movies";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function MovieCard({ movie }: { movie: Movie }) {

    return (
        <Card className="flex flex-row items-start gap-3 px-3 py-3 sm:items-stretch sm:gap-4 sm:px-4 sm:py-4">
            <div className="aspect-[2/3] w-20 shrink-0 sm:w-28 md:w-32">
                <img 
                    src={movie.poster_path ?? "/placeholder.png"}
                    alt={movie.title}
                    className="h-full w-full rounded-md object-cover"
                    />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
                <CardHeader className="p-0">
                    <CardTitle>{movie.title}</CardTitle>
                    <CardDescription>{movie.release_date}</CardDescription>
                </CardHeader>
                <CardDescription>
                    <p className="line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                        {movie.overview ? movie.overview : "No overview available."}
                    </p>
                </CardDescription>
            </div>
        </Card>
    );
}