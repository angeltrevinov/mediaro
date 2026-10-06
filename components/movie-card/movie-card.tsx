import { Movie } from "@/schemas/movies/movies";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function MovieCard({ movie }: { movie: Movie }) {

    return (
        <Card className="flex flex-row items-stretch px-4">
            <div className="sm:w-32 md:w-40 spect-[2/3] shrink-0">
                <img 
                    src={movie.poster_path ?? "/placeholder.png"}
                    alt={movie.title}
                    className="h-auto object-cover rounded-md"
                    />
            </div>
            <div className="flex flex-col flex-1 w-auto gap-4">
                <CardHeader className="p-0">
                    <CardTitle>{movie.title}</CardTitle>
                    <CardDescription>{movie.release_date}</CardDescription>
                </CardHeader>
                <CardDescription>
                    <p>{movie.overview ? movie.overview : "No overview available."}</p>
                </CardDescription>
            </div>
        </Card>
    );
}