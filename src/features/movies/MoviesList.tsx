import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { movieSelectors, requestMoviesPage, MoviesLoadingStatus, DEFAULT_PAGE } from './moviesSlice';
import MovieRow from './MovieRow';
import { Box, Snackbar } from '@material-ui/core';
import CustomPagination from '../../common/components/CustomPagination';
import { Alert } from '@material-ui/lab';

const MoviesList: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const currentPage = useAppSelector(movieSelectors.selectCurrentPageIndex);
    const movies   = useAppSelector(movieSelectors.selectMovies);
    const currentPageStatus = useAppSelector(movieSelectors.selectCurrentPageStatus);
    const requestedPage = useAppSelector(movieSelectors.selectRequestedPageIndex);
    const requestedPageStatus = useAppSelector(movieSelectors.selectRequestedPageStatus);
    const requestedPageError = useAppSelector(movieSelectors.selectRequestedPageError);

    useEffect(() => {
        if (currentPageStatus === MoviesLoadingStatus.IDLE) {
            dispatch(requestMoviesPage(currentPage));
        }
    }, [currentPageStatus, currentPage, dispatch]);

    const handlePaginationChange = (event: ChangeEvent<unknown>, page: number) => {
        dispatch(requestMoviesPage(page))
    };

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertText, setErrorAlertText] = useState('Something went wrong...');

    const handleCloseErrorAlert = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowErrorAlert(false);
    };

    useEffect(() => {
        if (requestedPageStatus === MoviesLoadingStatus.FAILED) {
            // Store error from that page
            setErrorAlertText(requestedPageError || 'Something went wrong...');
            setShowErrorAlert(true);
        }
    }, [requestedPage, requestedPageStatus, requestedPageError]);

    const isLoading = requestedPageStatus === MoviesLoadingStatus.LOADING;

    const pagination = <CustomPagination
        onChange={handlePaginationChange}
        page={currentPage}
        requestedPage={requestedPage}
        loading={isLoading}
        defaultPage={DEFAULT_PAGE}
    />;

    return (
        <>
            { pagination }
            {

                <Snackbar open={showErrorAlert} autoHideDuration={6000} onClose={handleCloseErrorAlert}>
                    <Alert onClose={handleCloseErrorAlert} severity="error">
                        { errorAlertText }
                    </Alert>
                </Snackbar>
            }
            {
                (currentPageStatus === MoviesLoadingStatus.SUCCEEDED) &&
                    <>
                        <Box>{
                            movies.map(movie => <MovieRow key={movie.id} data={movie} />)
                        }</Box>
                        pagination
                    </>
            }
        </>
    );
};

export default MoviesList;
