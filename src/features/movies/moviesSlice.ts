import { createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { Movie } from './Movie';

const initialState: EntityState<Movie> = {
    ids: ['1st', '2nd'],
    entities: {
        '1st': {
            id: '1st',
            image: 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg',
            title: 'Movie 1',
            rating: 8.7,
            year: 2020
        },
        '2nd': {
            id: '2nd',
            image: 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg',
            title: 'Movie 2',
            rating: 7.3,
            year: 2015
        },
    }
};

const moviesAdapter = createEntityAdapter<Movie>({
    selectId: (movie) => movie.id,
    // sortComparer: (a, b) => a.rating - b.rating,
});

const moviesSlice = createSlice({
    name: 'movies',
    initialState: initialState, // moviesAdapter.getInitialState(),
    reducers: {
        // moviesReceived(state, action) {
        //     // Or, call them as "mutating" helpers in a case reducer
        //     moviesAdapter.setAll(state, action.payload.movies)
        // },
    },
});

export const moviesReducer = moviesSlice.reducer;

const selectors = moviesAdapter.getSelectors((state: { movies: EntityState<Movie> }) => state.movies);
export const selectMovies = selectors.selectAll;
