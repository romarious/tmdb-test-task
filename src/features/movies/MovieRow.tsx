import { Box, Paper, Grid, makeStyles, Typography, Link } from '@material-ui/core';
import { FunctionComponent } from 'react';
import { Movie } from './Movie';

type MovieRowProps = {
    data: Movie
}

const useStyles = makeStyles({
    root: {
        flexGrow: 1
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
    poster: {
        width: '100%'
    }
});

const MovieRow: FunctionComponent<MovieRowProps> = ({ data }) => {
    const classes = useStyles(data);

    return (
        <Box marginY={2}>
            <Grid className={classes.root} container spacing={2} component={Paper} alignItems="stretch">
                <Grid item xs={2}>
                    <img src={data.image} alt="" className={classes.poster} />
                </Grid>
                <Grid item xs={10} container direction="column" justify="space-between">
                    <Grid item>
                        <Link href={`https://www.themoviedb.org/movie/${data.id}`} target="_blank" rel="noreferrer">
                            <Typography variant="body2" className={classes.title}>
                                {data.title}
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" className={classes.overview}>
                            {data.overview}
                        </Typography>
                    </Grid>
                    <Grid item container direction="row" justify="space-between">
                        <Grid item>
                            <Typography variant="body2" className={classes.textSecondary} color="textSecondary">
                                Year: {data.year}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" className={classes.textSecondary} color="textSecondary" align="right">
                                Rating: {data.rating}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MovieRow;
