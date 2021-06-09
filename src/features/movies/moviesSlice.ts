import { ActionReducerMapBuilder, createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { Movie } from './Movie';
import { fetchMoviesRequest } from './moviesApi';

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

const moviesAdapter = createEntityAdapter<Movie>({
    selectId: (movie) => movie.id,
    // sortComparer: (a, b) => a.rating - b.rating,
});

const initialState: MovieState = {
    data: moviesAdapter.getInitialState(),
    status: MoviesLoadingStatus.IDLE,
    error: null
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', fetchMoviesRequest);

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
        builder.addCase(fetchMovies.rejected, (state: MovieState, action) => {
            state.error = action.error.message || 'Request failed';
            state.status = MoviesLoadingStatus.FAILED;
        });
    }
});

export const moviesReducer = moviesSlice.reducer;

export const { selectAll: selectMovies } = moviesAdapter.getSelectors((state: { movies: MovieState }) => state.movies.data);
export const selectMoviesLoadError = (state: { movies: MovieState }) => state.movies.error;
export const selectMoviesLoadStatus = (state: { movies: MovieState }) => state.movies.status;
