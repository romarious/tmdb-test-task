import { ActionReducerMapBuilder, createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState } from "@reduxjs/toolkit";
import { Movie } from './Movie';
import { fetchMoviesRequest } from './moviesApi';

export const MOVIES_NS = 'movies';
export const DEFAULT_PAGE = 1;

export enum MoviesLoadingStatus {
    IDLE,
    LOADING,
    SUCCEEDED,
    FAILED
}

type MoviePage = {
    data: EntityState<Movie>,
    status: MoviesLoadingStatus,
    error: string | null
}

type MovieState = {
    currentPageIndex: number,
    requestedPage: number | null,
    pages: Record<number, MoviePage>
}

const moviesAdapter = createEntityAdapter<Movie>({
    selectId: (movie) => movie.id,
    // sortComparer: (a, b) => a.rating - b.rating,
});

const createPage = (status: MoviesLoadingStatus = MoviesLoadingStatus.IDLE) => ({
    data: moviesAdapter.getInitialState(),
    status,
    error: null
});

const initialState: MovieState = {
    currentPageIndex: DEFAULT_PAGE,
    requestedPage: null,
    pages: {}
};

export const fetchMovies = createAsyncThunk(`${MOVIES_NS}/fetchMovies`, fetchMoviesRequest);

const moviesSlice = createSlice({
    name: MOVIES_NS,
    initialState: initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<MovieState>) => {
        builder.addCase(fetchMovies.pending, (state: MovieState, action) => {
            const newPageIndex = action.meta.arg;
            if (!state.pages[newPageIndex]) {
                state.pages[newPageIndex] = createPage(MoviesLoadingStatus.LOADING);
            }
            const page = state.pages[newPageIndex];
            page.status = MoviesLoadingStatus.LOADING;
            state.requestedPage = newPageIndex;
        });
        builder.addCase(fetchMovies.fulfilled, (state: MovieState, action) => {
            const loadedPageIndex = action.meta.arg;
            const page = state.pages[loadedPageIndex];

            moviesAdapter.addMany(page.data, action.payload);
            page.status = MoviesLoadingStatus.SUCCEEDED;
            if (state.requestedPage === loadedPageIndex) {
                state.currentPageIndex = loadedPageIndex;
            }
        });
        builder.addCase(fetchMovies.rejected, (state: MovieState, action) => {
            const loadedPageIndex = action.meta.arg;
            const page = state.pages[loadedPageIndex];
            page.error = action.error.message || 'Request failed';
            page.status = MoviesLoadingStatus.FAILED;
        });
    }
});

export const moviesReducer = moviesSlice.reducer;

const selectMoviesSubState = (globalState: { [MOVIES_NS]: MovieState }) => globalState[MOVIES_NS];
const selectCurrentPageIndex = createSelector([selectMoviesSubState], (state: MovieState) => state.currentPageIndex);
const selectRequestedPageIndex = createSelector([selectMoviesSubState], (state: MovieState) => state.requestedPage);
const selectCurrentPage = createSelector([selectMoviesSubState, selectCurrentPageIndex], (state: MovieState, pageIndex) => state.pages[pageIndex] || createPage());
const selectRequestedPage = createSelector([selectMoviesSubState, selectRequestedPageIndex], (state: MovieState, pageIndex) => typeof pageIndex === 'number' && state.pages[pageIndex] || createPage());
const selectCurrentPageStatus = createSelector([selectCurrentPage], (page: MoviePage) => page.status);
const selectRequestedPageStatus = createSelector([selectRequestedPage], (page: MoviePage) => page.status);
const selectRequestedPageError = createSelector([selectRequestedPage], (page: MoviePage) => page.status === MoviesLoadingStatus.FAILED ? page.error : null);
const selectMoviesData = createSelector([selectCurrentPage], (page: MoviePage) => page.status === MoviesLoadingStatus.SUCCEEDED ? page.data : moviesAdapter.getInitialState());

const { selectAll: selectMovies } = moviesAdapter.getSelectors(selectMoviesData);

export const movieSelectors = {
    selectCurrentPageIndex,
    selectCurrentPageStatus,
    selectMovies,
    selectRequestedPageError,
    selectRequestedPageIndex,
    selectRequestedPageStatus
};
