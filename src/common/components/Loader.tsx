import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FunctionComponent } from "react";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        minHeight: '80vh'
    }
});

const Loader: FunctionComponent = () => {
    const classes = useStyles();

    return (
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
}

export default Loader;
