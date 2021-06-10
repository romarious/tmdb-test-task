import { Box, Paper, Grid, makeStyles, Typography, Link } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { EntityId } from '@reduxjs/toolkit';
import { ChangeEvent, FunctionComponent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { moviesActions, movieSelectors } from './moviesSlice';

type MovieRowProps = {
    movieId: EntityId
}

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    },
    favorite: {
        backgroundColor: '#fbf7e4'
    },
    poster: {
        width: '100%'
    },
    head: {
        display: 'grid',
        gridTemplateColumns: '1fr 30px'
    },
    title: {
        fontSize: '2.5vw'
    },
    overview: {
        fontSize: '1.5vw'
    },
    textSecondary: {
        fontSize: '1vw'
    },
});

const MovieRow: FunctionComponent<MovieRowProps> = ({ movieId }) => {
    const classes = useStyles();
    const movieData = useAppSelector((state) => movieSelectors.selectMovieById(state, movieId))!;
    const favorite = useAppSelector((state) => movieSelectors.selectMovieFavoriteFlag(state, movieId));
    const dispatch = useAppDispatch();

    const handleFavChange = (event: ChangeEvent<unknown>, newValue: number | null) => {
        dispatch(moviesActions.setFavorite({ id: movieId, flag: !!newValue }));
    };

    return (
        <Box marginY={2}>
            <Grid className={`${classes.root} ${favorite ? classes.favorite : ''}`} container spacing={2} component={Paper} alignItems="stretch">
                <Grid item xs={2}>
                    <img src={movieData.image} alt="" className={classes.poster} />
                </Grid>
                <Grid item xs={10} container direction="column" justify="space-between">
                    <Grid item className={classes.head}>
                        <Box>
                            <Link href={`https://www.themoviedb.org/movie/${movieData.id}`} target="_blank" rel="noreferrer">
                                <Typography className={classes.title} variant="body2" component="span">
                                    {movieData.title}
                                </Typography>
                            </Link>
                        </Box>
                        <Rating
                            name={`favorite-${movieId}`}
                            value={favorite ? 1 : 0}
                            onChange={handleFavChange}
                            max={1}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" className={classes.overview}>
                            {movieData.overview}
                        </Typography>
                    </Grid>
                    <Grid item container direction="row" justify="space-between">
                        <Grid item>
                            <Typography variant="body2" className={classes.textSecondary} color="textSecondary">
                                Year: {movieData.year}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" className={classes.textSecondary} color="textSecondary" align="right">
                                Rating: {movieData.rating}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MovieRow;
