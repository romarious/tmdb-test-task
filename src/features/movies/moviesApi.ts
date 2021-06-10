import { Movie } from './Movie';

const API_KEY = process.env.REACT_APP_API_KEY;

type MoviesResponseItem = {
    id: string,
    poster_path: string,
    title: string,
    vote_average: string,
    release_date: string,
    overview: string,
};

const delay = (duration: number = 1000) => new Promise(resolve => setTimeout(resolve, duration));

export async function fetchMoviesRequest (page: number): Promise<Movie[]> {
    await delay(500 + Math.random() * 2000); // for demonstration purposes

    if (Math.random() > 0.6) {
        throw new Error('Error for demonstration purposes - retry loading pressing on the desired page number again');
    }

    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();

    if (response.status !== 200) {
        throw new Error(`Failed to load movies, because of [${response.status}] ${data.status_code} ${data.status_message}`);
    }

    return data.results.map((item: MoviesResponseItem) => ({
        id: item.id,
        image: `https://image.tmdb.org/t/p/w300/${item.poster_path}`,
        title: item.title,
        overview: item.overview,
        rating: item.vote_average,
        year: item.release_date.substr(0, 4)
    }));
}
