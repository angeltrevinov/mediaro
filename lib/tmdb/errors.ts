/**
 * Thrown when TMDB responds with a 404 for a requested resource
 */
export class TMDBNotFoundError extends Error {
    constructor(message: string = "TMDB resource not found") {
        super(message);
        this.name = "TMDBNotFoundError";
    }
}
