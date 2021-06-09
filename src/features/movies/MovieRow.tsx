import { Box, Paper, Grid, makeStyles, Typography } from '@material-ui/core';
import { FunctionComponent } from 'react';
import { Movie } from './Movie';

type MovieRowProps = {
    data: Movie
}

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    },
    thumbnail: {
        height: '10vw',
        backgroundImage: (data: Movie) => `url(${data.image})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    }
});

const MovieRow: FunctionComponent<MovieRowProps> = ({ data }) => {
    const classes = useStyles(data);

    return (
        <Box marginY={2}>
            <Grid className={classes.root} container spacing={2} component={Paper} alignItems="stretch">
                <Grid item xs={3}>
                    <Paper className={classes.thumbnail} square variant="outlined"/>
                </Grid>
                <Grid item xs={9} container direction="column" justify="space-between">
                    <Grid item>
                        <Typography variant="body2">
                            {data.title}
                        </Typography>
                    </Grid>
                    <Grid item container direction="row" justify="space-between">
                        <Grid item>
                            <Typography variant="body2" color="textSecondary">
                                Year: {data.year}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" color="textSecondary" align="right">
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
