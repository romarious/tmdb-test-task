import { ActionReducerMapBuilder, createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";

const API_KEY = process.env.REACT_APP_API_KEY;

type Movie = {
    id: string,
    image: string,
    title: string,
    rating: number,
    year: number
};

type MoviesResponseItem = {
    id: string,
    backdrop_path: string,
    title: string,
    vote_average: string,
    release_date: string,
};

export enum MoviesLoadingStatus {
    IDLE,
    LOADING,
    SUCCEEDED,
    FAILED
}

type MovieState = {
    data: EntityState<Movie>,
    status: MoviesLoadingStatus,
    error: string | null
}

export type { Movie };

const moviesAdapter = createEntityAdapter<Movie>({
    selectId: (movie) => movie.id,
    // sortComparer: (a, b) => a.rating - b.rating,
});

const initialState: MovieState = {
    data: moviesAdapter.getInitialState(),
    status: MoviesLoadingStatus.IDLE,
    error: null
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (): Promise<Movie[]> => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`);
    if (response.status !== 200) {
        throw new Error(`Failed to load movies, because of [${response.status}] ${await response.text()}`);
    }

    const data = await response.json();
    return data.results.map((item: MoviesResponseItem) => ({
        id: item.id,
        image: `https://image.tmdb.org/t/p/w300/${item.backdrop_path}`,
        title: item.title,
        rating: item.vote_average,
        year: item.release_date.substr(0, 4)
    }));
});

const moviesSlice = createSlice({
    name: 'movies',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<MovieState>) => {
        builder.addCase(fetchMovies.pending, (state: MovieState, action) => {
            state.status = MoviesLoadingStatus.LOADING;
        });
        builder.addCase(fetchMovies.fulfilled, (state: MovieState, action) => {
            moviesAdapter.addMany(state.data, action.payload);
            state.status = MoviesLoadingStatus.SUCCEEDED;
        });
    }
});

export const moviesReducer = moviesSlice.reducer;

export const { selectAll: selectMovies } = moviesAdapter.getSelectors((state: { movies: MovieState }) => state.movies.data);
export const selectMoviesLoadStatus = (state: { movies: MovieState }) => state.movies.status;
