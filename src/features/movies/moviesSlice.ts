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
    currentPage: number,
    loadingPage: number | null,
    pages: Record<number, MoviePage>
}

const moviesAdapter = createEntityAdapter<Movie>({
    selectId: (movie) => movie.id,
    // sortComparer: (a, b) => a.rating - b.rating,
});

const createPage = () => ({
    data: moviesAdapter.getInitialState(),
    status: MoviesLoadingStatus.IDLE,
    error: null
});

const initialState: MovieState = {
    currentPage: DEFAULT_PAGE,
    loadingPage: null,
    pages: {
        [DEFAULT_PAGE]: createPage()
    }
};

export const fetchMovies = createAsyncThunk(`${MOVIES_NS}/fetchMovies`, fetchMoviesRequest);

const moviesSlice = createSlice({
    name: MOVIES_NS,
    initialState: initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<MovieState>) => {
        builder.addCase(fetchMovies.pending, (state: MovieState, action) => {
            const newPageNumber = action.meta.arg;
            if (!state.pages[newPageNumber]) {
                state.pages[newPageNumber] = createPage();
            }
            const page = state.pages[newPageNumber];
            page.status = MoviesLoadingStatus.LOADING;
            state.loadingPage = newPageNumber;
        });
        builder.addCase(fetchMovies.fulfilled, (state: MovieState, action) => {
            const loadedPageNumber = action.meta.arg;
            const page = state.pages[loadedPageNumber];

            moviesAdapter.addMany(page.data, action.payload);
            page.status = MoviesLoadingStatus.SUCCEEDED;
            if (state.loadingPage === loadedPageNumber) {
                state.currentPage = loadedPageNumber;
            }
        });
        builder.addCase(fetchMovies.rejected, (state: MovieState, action) => {
            const loadedPageNumber = action.meta.arg;
            const page = state.pages[loadedPageNumber];
            page.error = action.error.message || 'Request failed';
            page.status = MoviesLoadingStatus.FAILED;
        });
    }
});

export const moviesReducer = moviesSlice.reducer;

const selectMoviesSubState = (globalState: { [MOVIES_NS]: MovieState }) => globalState[MOVIES_NS];
const selectCurrentPageNumber = createSelector([selectMoviesSubState], (state: MovieState) => state.currentPage);
const selectLoadingPageNumber = createSelector([selectMoviesSubState], (state: MovieState) => state.loadingPage);
const selectCurrentPage = createSelector([selectMoviesSubState, selectCurrentPageNumber], (state: MovieState, page) => state.pages[page]);
const selectMoviesLoadStatus = createSelector([selectCurrentPage], (state: MoviePage) => state.status);
const selectMoviesLoadError = createSelector([selectCurrentPage], (state: MoviePage) => state.error);
const selectMoviesData = createSelector([selectCurrentPage], (state: MoviePage) => state.data);

const { selectAll: selectMovies } = moviesAdapter.getSelectors(selectMoviesData);

export const movieSelectors = {
    selectCurrentPageNumber,
    selectLoadingPageNumber,
    selectMovies,
    selectMoviesLoadError,
    selectMoviesLoadStatus,
};
