const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_KEY}`
  }
};

// Utility to construct the full poster URL from TMDB
export function getPosterUrl(posterPath?: string, size: string = 'w500'): string | null {
    if (!posterPath) return null;
    return `${TMDB_IMAGE_BASE_URL}${size}${posterPath}`;
}

export async function searchMovies(
    query: string,
    page: number = 1,
    language: string = 'en-US',
    nsfw: boolean = false,
): Promise<any> {
    const url = `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=${nsfw}&language=${language}&page=${page}`;
    try {
        const response = await fetch(url, TMDB_OPTIONS);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};