import { ChangeEvent, FunctionComponent } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { PaginationItem, Pagination, PaginationRenderItemParams } from '@material-ui/lab';

const useStyles = makeStyles({
    wrapper: {
        display: 'grid',
        gridTemplateColumns: '30px 1fr'
    },
    pagination: {
        display: 'block',
        margin: '0 auto',
        width: 'fit-content'
    },
    requested: {
        border: '1px solid #eee'
    }
});

type CustomPaginationProps = {
    onChange: (event: ChangeEvent<unknown>, page: number) => void,
    defaultPage: number,
    page: number,
    loading: boolean,
    requestedPage: number | null
};

const CustomPagination: FunctionComponent<CustomPaginationProps> = ({ loading, requestedPage, ...otherProps }) => {
    const classes = useStyles();

    const renderItem = (item: PaginationRenderItemParams) => {
        const className = item.page === requestedPage ? classes.requested : '';
        return <PaginationItem className={className} {...item} />
    };;

    return (
        <Box className={classes.wrapper}>
            {loading ? <CircularProgress size={20} /> : <div />}
            <Pagination
                className={classes.pagination}
                siblingCount={2}
                boundaryCount={2}
                count={25}
                shape="rounded"
                renderItem={renderItem}
                {...otherProps}
            />
        </Box>
    );
};

export default CustomPagination;
