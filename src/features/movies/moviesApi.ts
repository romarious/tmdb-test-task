import { Movie } from './Movie';

const API_KEY = process.env.REACT_APP_API_KEY;

type MoviesResponseItem = {
    id: string,
    backdrop_path: string,
    title: string,
    vote_average: string,
    release_date: string,
};

export async function fetchMoviesRequest (): Promise<Movie[]> {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`);
    const data = await response.json();

    if (response.status !== 200) {
        throw new Error(`Failed to load movies, because of [${response.status}] ${data.status_code} ${data.status_message}`);
    }

    return data.results.map((item: MoviesResponseItem) => ({
        id: item.id,
        image: `https://image.tmdb.org/t/p/w300/${item.backdrop_path}`,
        title: item.title,
        rating: item.vote_average,
        year: item.release_date.substr(0, 4)
    }));
}
