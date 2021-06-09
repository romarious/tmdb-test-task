import { FunctionComponent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectMovies, selectMoviesLoadStatus, fetchMovies, MoviesLoadingStatus } from './moviesSlice';
import MovieRow from './MovieRow';
import { Box, Grid, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        minHeight: '80vh'
    }
});

const MoviesList: FunctionComponent = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const movies   = useAppSelector(selectMovies);
    const moviesLoadStatus = useAppSelector(selectMoviesLoadStatus);

    useEffect(() => {
        if (moviesLoadStatus === MoviesLoadingStatus.IDLE) {
            dispatch(fetchMovies())
        }
    }, [moviesLoadStatus, dispatch]);

    const Loader = (
        <Grid
            className={classes.root}
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <CircularProgress />
        </Grid>
    );

    return (
        <Box>{
            moviesLoadStatus === MoviesLoadingStatus.SUCCEEDED
            ? movies.map(movie => <MovieRow key={movie.id} data={movie} />)
            : Loader
        }</Box>
    );
};

export default MoviesList;
