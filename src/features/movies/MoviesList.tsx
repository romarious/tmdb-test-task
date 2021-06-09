import { FunctionComponent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectMovies, selectMoviesLoadStatus, selectMoviesLoadError, fetchMovies, MoviesLoadingStatus } from './moviesSlice';
import MovieRow from './MovieRow';
import Loader from '../../common/components/Loader';
import { Box, Typography } from '@material-ui/core';

const MoviesList: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const movies   = useAppSelector(selectMovies);
    const moviesLoadStatus = useAppSelector(selectMoviesLoadStatus);
    const moviesLoadError = useAppSelector(selectMoviesLoadError);

    useEffect(() => {
        if (moviesLoadStatus === MoviesLoadingStatus.IDLE) {
            dispatch(fetchMovies())
        }
    }, [moviesLoadStatus, dispatch]);

    if (moviesLoadStatus === MoviesLoadingStatus.IDLE || moviesLoadStatus === MoviesLoadingStatus.LOADING) {
        return <Loader />;
    }

    if (moviesLoadStatus === MoviesLoadingStatus.FAILED) {
        return (
            <Typography variant="h3" align="center" color="error">
                { moviesLoadError || 'Something went wrong...'}
            </Typography>
        );
    }

    return (
        <Box>{
            movies.map(movie => <MovieRow key={movie.id} data={movie} />)
        }</Box>
    );
};

export default MoviesList;
