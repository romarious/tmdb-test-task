import { ChangeEvent, FunctionComponent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { movieSelectors, fetchMovies, MoviesLoadingStatus, DEFAULT_PAGE } from './moviesSlice';
import MovieRow from './MovieRow';
import Loader from '../../common/components/Loader';
import { Box, Typography } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    pagination: {
        margin: '0 auto',
        width: 'fit-content'
    }
});

const MoviesList: FunctionComponent = () => {
    const classes = useStyles();

    const dispatch = useAppDispatch();
    const currentPage = useAppSelector(movieSelectors.selectCurrentPageNumber);
    const movies   = useAppSelector(movieSelectors.selectMovies);
    const moviesLoadStatus = useAppSelector(movieSelectors.selectMoviesLoadStatus);
    const moviesLoadError = useAppSelector(movieSelectors.selectMoviesLoadError);

    useEffect(() => {
        if (moviesLoadStatus === MoviesLoadingStatus.IDLE) {
            dispatch(fetchMovies(currentPage));
        }
    }, [moviesLoadStatus, currentPage, dispatch]);

    const handlePaginationChange = (event: ChangeEvent<unknown>, page: number) => {
        dispatch(fetchMovies(page))
    };

    return (
        <>
            <Pagination
                className={classes.pagination}
                siblingCount={2}
                boundaryCount={2}
                count={25}
                shape="rounded"
                onChange={handlePaginationChange}
                page={currentPage}
                defaultPage={DEFAULT_PAGE}
            />
            {
                (moviesLoadStatus === MoviesLoadingStatus.IDLE || moviesLoadStatus === MoviesLoadingStatus.LOADING) &&
                    <Loader />
            }
            {
                (moviesLoadStatus === MoviesLoadingStatus.FAILED) &&
                    <Typography variant="h3" align="center" color="error">
                        { moviesLoadError || 'Something went wrong...'}
                    </Typography>
            }
            {
                (moviesLoadStatus === MoviesLoadingStatus.SUCCEEDED) &&
                    <Box>{
                        movies.map(movie => <MovieRow key={movie.id} data={movie} />)
                    }</Box>
            }
        </>
    );
};

export default MoviesList;
